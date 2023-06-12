/**
 * 通用返回层
 */
import { Context } from 'koa'
import { writeLog } from '../utils/log'

const IndexCon = (message?: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      if (ctx.state.buffer) {
        ctx.body = ctx.state.buffer
      } else {
        const repObj = {
          code: 200,
          message: message || '操作成功！'
        }
        ctx.state.formatData &&
          Object.assign(repObj, {
            result: ctx.state.formatData
          })
        ctx.body = repObj
      }

      writeLog('0', ctx)
    } catch (error) {
      console.error('返回层失败', error)
      return ctx.app.emit('error', {}, ctx)
    }
  }
}

export default IndexCon
