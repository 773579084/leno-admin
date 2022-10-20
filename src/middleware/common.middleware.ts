import { Context } from 'koa'
import { imgType } from '../types'
import errors from '../constants/err.type'
import { removeSpecifyFile } from '../utils'
import path from 'path'
const { unAvatarSizeErr, unSupportedFileErr } = errors

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
