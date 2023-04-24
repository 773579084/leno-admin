import { Context } from 'koa'
import { dictMapListType } from '@/types'
import errors from '@/app/err.type'
import { getExcelAddress, parsingExcel } from '@/business/utils/excel'
import { getDataTypeSer } from '@/business/service/system/dict_data.service'
import { formatHumpLineTransfer, removeSpecifyFile, timeChange } from '@/business/utils'
import path from 'path'
const { importUserListErr, sqlErr, verifyErr, exportUserListErr } = errors
import { userExcelHeader } from '@/business/public/excelMap'
import bcrypt from 'bcryptjs'
import XLSX from 'exceljs'
import { ModelStatic, Op } from 'sequelize'

// 下划线转驼峰
export const formatHandle = async (ctx: Context, next: () => Promise<void>) => {
  const res = await formatHumpLineTransfer(ctx.state.formatData)
  // 转换时间格式
  ctx.state.formatData = await timeChange(res)
  await next()
}

/**
 * 判断 是否不唯一(sql与upload需要按照对应顺序传入)
 * @param sqlNames 需要判断唯一变量的key[]
 * @param Model sql表单
 * @param isEdit 如果是编辑则判断唯一变量需要除开自己
 * @returns
 */
export const verifyMid = (sqlNames: string[], Model: ModelStatic<any>, isEdit?: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const body = ctx.request['body'] as any

      const res = formatHumpLineTransfer(body, 'line')
      const whereOpt = {}
      if (isEdit) {
        Object.assign(whereOpt, {
          [isEdit]: {
            [Op.ne]: res[isEdit]
          }
        })
      }

      sqlNames.forEach((item, index) => {
        res[item] && Object.assign(whereOpt, { [sqlNames[index]]: res[item] })
      })

      // ser 查找是否有值
      const isRepeat = (await Model.findOne({
        raw: true,
        attributes: [...sqlNames],
        where: whereOpt
      })) as any

      if (isRepeat) {
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

          // 拿取字段头数据转成key
          const headerKeys = []
          sheetValues[0].shift()
          sheetValues[0].forEach((header: string, index: number) => {
            headerKeys.push(userExcelHeader[index].dataIndex)
          })
          sheetValues.shift()
          // 第三遍遍历，解析组合数据
          sheetValues.forEach((value: (string | number | null)[]) => {
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
export const judegImportMid = (table: ModelStatic<any>, updates: string[]) => {
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

    await next()
  }
}

// 导出列表数据及字典转换（excel）
export const exportExcelMid = (
  serve: Function,
  model: ModelStatic<any>,
  maps?: { [key: string]: string }
) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      if (serve) {
        const res = await serve(model)
        ctx.state.formatData = res
      }

      // 字典转换
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
