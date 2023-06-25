import schedule from 'node-schedule'
import target from './invokeTarget'

/**
 * 新增/修改 定时任务
 * @param id
 * @param cron
 * @param funStr
 * @returns
 */
export const addEditJob = (id: string, cron: string, funStr: string) => {
  console.log(5, cron, funStr, target[funStr])
  schedule.scheduleJob(id, cron, target[funStr])
}

/**
 * 查看定时任务列表
 */
export const scheduleAll = () => {
  return schedule.scheduledJobs
}

/**
 * 删除定时任务
 * @param id
 */
export const cancelJob = (id: string) => {
  schedule.cancelJob(id)
}

/**
 * 立即执行一次
 * @param funStr
 */
export const runOneJob = (funStr: string) => {
  // 因为程序执行会存在异步时间差，所以我们需要将时间往后延迟数百毫秒，以保证当前时间在定时任务创建之后执行
  const time = Date.now() + 200
  schedule.scheduleJob(time, target[funStr])
}
