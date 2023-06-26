import schedule from 'node-schedule'
import target from './invokeTarget'

/**
 * 解析上传 调用目标字符串
 * @param str
 * @returns {fun:调用函数名,par:函数传值}
 */
const parsingFunStr = (str: string): { fun: string; par: string[] } => {
  if (/\(|\)/.test(str)) {
    const regex = /\((.*?)\)/
    const match = str.match(regex)
    console.log(14, match)
    return {
      fun: str.split('(')[0],
      par: match[1].split(',')
    }
  } else {
    return {
      fun: str,
      par: []
    }
  }
}

/**
 * 新增/修改 定时任务
 * @param id
 * @param cron
 * @param funStr
 * @returns
 */
export const addEditJob = (id: string, cron: string, funStr: string) => {
  const { fun, par } = parsingFunStr(funStr)
  schedule.scheduleJob(id, cron, () => {
    target[fun](...par)
  })
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
  const { fun, par } = parsingFunStr(funStr)
  const time = Date.now() + 200
  schedule.scheduleJob(time, () => {
    target[fun](...par)
  })
}
