import { IjobSer } from '@/types/monitor/job'
import { Context } from 'koa'
import { writeJobLog } from './log'

// 测试 立即执行
const addEditFn = (ctx: Context, job: IjobSer) => {
  try {
    console.log(3, new Date())
    writeJobLog(ctx, job, '0', '测试立即执行成功')
  } catch (error) {
    console.error('测试立即执行失败', error)
    writeJobLog(ctx, job, '1', '测试立即执行失败')
  }
}

export default {
  addEditFn
}
