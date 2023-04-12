import { Context } from 'koa'
import { dictMapListType, imgType } from '@/types'
import errors from '@/constants/err.type'
import { getExcelAddress, parsingExcel } from '@/utils/excel'
import { exportExcelSer } from '@/service/system/dict_type.service'
import { getDataTypeSer } from '@/service/system/dict_data.service'
import { removeSpecifyFile } from '@/utils'
import path from 'path'
const {
  unAvatarSizeErr,
  unSupportedFileErr,
  importUserListErr,
  checkIdsErr,
  sqlErr,
  verifyErr,
  exportUserListErr
} = errors
import { userExcelHeader } from '@/public/excelMap'
import bcrypt from 'bcryptjs'
import XLSX from 'exceljs'
import { IdsJudge } from '@/schema/common.schema'

// 判断 上传图片的 大小是否合适
export const contrastFileSizeSchema = (limitSize = 1024 * 1024) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const { avatar } = ctx.request?.files
    const { size } = avatar as imgType

    if (size > limitSize) {
      console.error('图片超过大小限制')
      return ctx.app.emit('error', unAvatarSizeErr, ctx)
    }
    await next()
  }
}
// 判断 上传图片的格式
export const judImgFormatSchema = (imgFormat = ['image/jpeg', 'image/png']) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const { avatar } = ctx.request.files // files 是koa-body提供的文件地址位置
    const { mimetype, filepath } = avatar as imgType
    const basePath = path.basename(filepath) as string

    if (!imgFormat.includes(mimetype)) {
      removeSpecifyFile(basePath)
      console.error('图片上传格式错误,请上传jpeg/png格式')
      return ctx.app.emit('error', unSupportedFileErr, ctx)
    }
    await next()
  }
}

// 导入excel--解析
export const importExcelsMid = (option: { password: boolean }) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const { password } = option
      const fileExistPath = path.resolve() + '\\src\\upload'
      const fileNames = await getExcelAddress(fileExistPath)

      // 获取字典的值
      const dicts = ctx.state.dicts

      // 存储多个excel文件
      const workbooksFromBuffer = []
      for (let i = 0; i < fileNames.length; i++) {
        const res = await parsingExcel(fileNames[i], fileExistPath)
        workbooksFromBuffer.push(res)
      }

      // 存储excel表提取的excel数据
      const dataSource = []

      // 第一遍遍历处每个excel文件
      workbooksFromBuffer.forEach((workbook) => {
        // 第二遍遍历操作每个excel文件夹里的每个excel表
        workbook._worksheets.forEach((sheet: XLSX.Worksheet) => {
          // 删除sheet开头的空行
          const sheetValues = workbook.getWorksheet(sheet.id).getSheetValues()
          sheetValues.shift()
          console.log(76, sheetValues)

          // 拿取字段头数据转成key
          const headerKeys = []
          sheetValues[0].shift()
          sheetValues[0].forEach((header: string, index: number) => {
            headerKeys.push(userExcelHeader[index].dataIndex)
          })
          sheetValues.shift()
          // 第三遍遍历，解析组合数据
          sheetValues.forEach((value: (string | number | null)[]) => {
            console.log(77, value)

            value.shift()
            const obj = {}
            value.forEach((item, index: number) => {
              // 如果值为字典内有的值，则需要转换
              const dictKey = dicts[headerKeys[index]]

              if (dictKey) {
                for (const key in dictKey) {
                  if (item === dictKey[key]) {
                    obj[headerKeys[index]] = key
                  }
                }
              } else {
                obj[headerKeys[index]] = item
              }
              if (password) {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync('123456', salt)
                obj['password'] = hash
              }
            })
            dataSource.push(obj)
          })
        })
      })

      // 获取数据后删除excel文件
      fileNames.forEach((path) => {
        removeSpecifyFile(path)
      })

      ctx.state.excelData = dataSource
    } catch (error) {
      console.error('用户excel上传表头格式不正确!', ctx.request['body'])
      return ctx.app.emit('error', importUserListErr, ctx)
    }
    await next()
  }
}

// 导入excel--修改sql
export const judegImportMid = (table, updates) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const { updateSupport } = ctx.request['body'] as {
      updateSupport: string
    }

    try {
      if (updateSupport === '1') {
        // 新增 且 修改
        await table.bulkCreate(ctx.state.excelData, {
          updateOnDuplicate: updates
        })
      } else {
        // 不更改 只新增
        await table.bulkCreate(ctx.state.excelData)
      }
    } catch (error) {
      console.error('user excel新增与修改错误', ctx.request['body'])
      return ctx.app.emit('error', { code: '400', message: error.errors[0].message }, ctx)
    }

    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '用户信息上传成功！'
    }
  }
}

// 判断id是否正确
export const judgeIdSchema = () => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const list = ctx.request.path.split('/')
      const ids = list[list.length - 1]
      const idsList = ids.split(',')
      await IdsJudge.validateAsync({ ids: idsList })
      ctx.state.ids = idsList
    } catch (error) {
      console.error('id格式错误!', ctx.request['body'])
      return ctx.app.emit('error', checkIdsErr, ctx)
    }
    await next()
  }
}

// 判断 是否不唯一
export const verify = (sqlName: string, uploadName: string, getListSer: Function) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const res = ctx.request['body'] as any
      const obj = (await getListSer({ [sqlName]: res[uploadName] })) as {
        count: number
        rows: string[]
      }
      if (obj.count) {
        console.error('内容已存在,不唯一!', ctx.request['body'])
        ctx.app.emit('error', verifyErr, ctx)
        return
      }
    } catch (error) {
      console.error('sql查询信息错误', error)
      ctx.app.emit('error', sqlErr, ctx)
    }

    await next()
  }
}

// 导出列表数据及字典转换（excel）
export const exportExcelMid = (serve?: Function, maps?: { [key: string]: string }) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      if (serve) {
        const res = await serve()
        ctx.state.formatData = res
      }

      if (maps) {
        const arr = {} as unknown as dictMapListType
        for (let key in maps) {
          const dict = await getDataTypeSer({ dict_type: maps[key] })
          arr[key] = dict
        }
        ctx.state.dicts = arr
      }
    } catch (error) {
      console.error('导出用户列表错误!', ctx.request['body'])
      return ctx.app.emit('error', exportUserListErr, ctx)
    }
    await next()
  }
}

// 导出列表数据及字典转换（excel）
export const importExcelDictMapMid = (maps?: { [key: string]: string }) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      if (maps) {
        const arr = {} as unknown as dictMapListType
        for (let key in maps) {
          const dict = await getDataTypeSer({ dict_type: maps[key] })
          arr[key] = dict
        }
        ctx.state.dicts = arr
      }
    } catch (error) {
      console.error('导出用户列表错误!', ctx.request['body'])
      return ctx.app.emit('error', exportUserListErr, ctx)
    }
    await next()
  }
}
