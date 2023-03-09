import { Context } from 'koa'
import { imgType } from '@/types'
import errors from '@/constants/err.type'
import { removeSpecifyFile } from '@/utils'
import path from 'path'
const { unAvatarSizeErr, unSupportedFileErr, importUserListErr } = errors
import xlsx from 'node-xlsx'
let fs = require('fs')
import { excelMap } from '@/public/map'
import { password } from '@/schema/common.schema'

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
    const { avatar } = ctx.request?.files // files 是koa-body提供的文件地址位置
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

// 导入用户excel解析
export const importUsersMid = (tableName: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const { excel } = ctx.request?.files

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
      console.log(45, workSheetsFromBuffer)

      const arr = [] // 存储sql批量创建的信息 object[]
      workSheetsFromBuffer.forEach((element) => {
        element.forEach((item: any) => {
          // 此层是遍历表数量(单表数据提取)
          const data = item.data
          for (let j = 1; j < data.length; j++) {
            // 此层是加入每行数据
            const obj = {}
            for (let i = 0; i < data[0].length; i++) {
              obj[excelMap[tableName][data[0][i]]] = data[j][i]
            }
            arr.push(obj)
          }
        })
      })
      console.log(69, arr)
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

// 导入用户excel解析
export const judegImportMid = (table) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      console.log(96, ctx.state.excelData, table)
      table
        .bulkCreate([{ password: '123456', ...ctx.state.excelData[0] }])
        .then((item) => {
          console.log(99, item)
          ctx.body = item
        })
        .catch((err) => {
          console.log(102, err)
        })
    } catch (error) {
      console.error('sss!', ctx.request['body'])
      return ctx.app.emit('error', importUserListErr, ctx)
    }
  }
}
