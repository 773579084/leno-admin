import { Context } from 'koa'
import { formatHumpLineTransfer, timeChange } from '../utils'

const formatHandle = async (ctx: Context, next: () => Promise<void>) => {
  // 下划线转驼峰
  const res = await formatHumpLineTransfer(ctx.state.formatData)
  // 转换时间格式
  ctx.state.formatData = await timeChange(res)
  await next()
}

export default formatHandle
