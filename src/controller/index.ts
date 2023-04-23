/**
 * 通用返回层
 */
import { Context } from 'koa'

const IndexCon = (message?: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    // console.log(15, ctx.state.formatData, ctx.state.buffer)

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
  }
}

export default IndexCon
