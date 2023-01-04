import { Context } from 'koa'
import { formatHumpLineTransfer } from '../utils'

const formatHandle = async (ctx: Context, next: () => Promise<void>) => {
  ctx.state.formatData = await formatHumpLineTransfer(ctx.state.formatData)
  await next()
}

export default formatHandle
