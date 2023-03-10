import { Context } from 'koa'
import { imgType } from '@/types'
import errors from '@/constants/err.type'
import { removeSpecifyFile } from '@/utils'
import path from 'path'
const { unAvatarSizeErr, unSupportedFileErr, importUserListErr } = errors
import xlsx from 'node-xlsx'
let fs = require('fs')
import { excelMap } from '@/public/map'
import bcrypt from 'bcryptjs'

// 判断 上传图片的 大小是否合适
export const contrastFileSizeSchema = (limitSize = 1024 * 1024) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const { avatar } = ctx.request.files
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
export const importExcelsMid = (tableMap: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const fileExistPath = path.resolve() + '\\src\\upload'
      let fileName = [] // 多个excel文件保存地
      fs.readdirSync(path.format({ dir: fileExistPath })).forEach((excel) => {
        if (excel.split('.')[excel.split('.').length - 1] === 'xlsx' && 'xls') {
          fileName.push(excel)
        }
      })
      // 拿去多个excel文件
      const workSheetsFromBuffer = []
      fileName.forEach((item) => {
        const absoluteFilePath = fileExistPath + '\\' + item //整个文件的绝对路径
        workSheetsFromBuffer.push(xlsx.parse(fs.readFileSync(absoluteFilePath))) //这种方式是解析buffer
      })
      // 生成默认用户密码
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync('123456', salt)
      const arr = [] // 存储sql批量创建的信息 object[]
      workSheetsFromBuffer.forEach((element) => {
        element.forEach((item: any) => {
          // 此层是遍历表数量(单表数据提取)
          const data = item.data
          for (let j = 1; j < data.length; j++) {
            // 此层是加入每行数据
            const obj = {
              password: hash
            }
            for (let i = 0; i < data[0].length; i++) {
              let key = excelMap[tableMap][data[0][i]]
              if (excelMap.changDict[key]) {
                obj[key] = excelMap.changDict[key][data[j][i]]
              } else {
                obj[key] = data[j][i]
              }
            }
            arr.push(obj)
          }
        })
      })
      console.log(88, arr)
      // 获取数据后删除excel文件
      fileName.forEach((path) => {
        removeSpecifyFile(path)
      })

      ctx.state.excelData = arr
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
    const { updateSupport } = ctx.query
    try {
      if (updateSupport === '1') {
        console.log(104, updateSupport)
        // 新增 且 修改
        await table.bulkCreate(ctx.state.excelData, {
          updateOnDuplicate: updates
        })
      } else {
        console.log(119, updateSupport)
        // 不更改 只新增
        await table.bulkCreate(ctx.state.excelData)
      }
      ctx.body = {
        code: 200,
        message: '用户信息上传成功！'
      }
    } catch (error) {
      console.error('user excel新增与修改错误', ctx.request['body'])
      return ctx.app.emit('error', { code: '400', message: error.errors[0].message }, ctx)
    }
  }
}
