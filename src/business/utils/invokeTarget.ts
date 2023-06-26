import MonitorJobLog from '@/mysql/model/monitor/jobLog.model'
import SysLogininfor from '@/mysql/model/system/logininfor.model'
import SysOperLog from '@/mysql/model/system/operlog.model'
import { IjobSer } from '@/types/monitor/job'
import { Context } from 'koa'
import { Op } from 'sequelize'
import { delFiles } from '.'
import { delSer } from '../service'
import { writeJobLog } from './log'

/**
 * 测试 立即执行
 * @param ctx
 * @param job
 */
const addEditFn = (ctx: Context, job: IjobSer, a: string, b: string, c: string) => {
  try {
    console.log(3, new Date())
    writeJobLog(ctx, job, '0', '测试立即执行成功')
  } catch (error) {
    console.error('测试立即执行失败', error)
    writeJobLog(ctx, job, '1', '测试立即执行失败')
  }
}

/**
 * 定时清理 log
 * @param ctx
 * @param job
 */
const timingCleanLog = async (ctx: Context, job: IjobSer) => {
  try {
    // 清除 log 下的日志文件
    delFiles(__dirname.split('\\src')[0] + `/src/log`)
    // 清除 操作日志
    await delSer(SysOperLog, { oper_id: { [Op.ne]: null } })
    // 清除 登录日志
    await delSer(SysLogininfor, { info_id: { [Op.ne]: null } })
    // 清除 调度日志
    await delSer(MonitorJobLog, { job_log_id: { [Op.ne]: null } })
    writeJobLog(ctx, job, '0', '定时清理 log成功')
  } catch (error) {
    console.error('定时清理 log失败', error)
    writeJobLog(ctx, job, '1', '定时清理 log失败')
  }
}

export default {
  addEditFn,
  timingCleanLog
}
