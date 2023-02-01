import { Context } from 'koa'
import { formatHumpLineTransfer, timeChange } from '../utils'

// 下划线转驼峰
export const formatHandle = async (ctx: Context, next: () => Promise<void>) => {
  const res = await formatHumpLineTransfer(ctx.state.formatData)
  // 转换时间格式
  ctx.state.formatData = await timeChange(res)
  await next()
}
