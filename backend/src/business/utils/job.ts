import { Context } from 'koa';
import schedule from 'node-schedule';
import { IjobSer } from '@/types/monitor/job';
import target from './invokeTarget';

/**
 * 解析上传 调用目标字符串
 * @param str
 * @returns {fun:调用函数名,par:函数传值}
 */
const parsingFunStr = (str: string): { fun: string; par: string[] } => {
  if (/\(|\)/.test(str)) {
    const regex = /\((.*?)\)/;
    const match = str.match(regex);
    return {
      fun: str.split('(')[0],
      par: match[1].split(','),
    };
  }
  return {
    fun: str,
    par: [],
  };
};

/**
 * 新增/修改 定时任务
 * @param ctx
 * @param job
 * @returns
 */
export const addEditJob = (ctx: Context, job: IjobSer) => {
  const { fun, par } = parsingFunStr(job.invoke_target);

  schedule.scheduleJob(String(job.job_id), job.cron_expression, () => {
    target[fun](ctx, job, ...par);
  });
};

/**
 * 查看定时任务列表
 */
export const scheduleAll = () => schedule.scheduledJobs;

/**
 * 删除定时任务
 * @param id
 */
export const cancelJob = (id: string) => {
  schedule.cancelJob(id);
};

/**
 * 立即执行一次
 * @param ctx
 * @param job
 */
export const runOneJob = (ctx: Context, job: IjobSer) => {
  // 因为程序执行会存在异步时间差，所以我们需要将时间往后延迟数百毫秒，以保证当前时间在定时任务创建之后执行
  const { fun, par } = parsingFunStr(job.invoke_target);
  const time = Date.now() + 200;
  schedule.scheduleJob(time, () => {
    target[fun](ctx, job, ...par);
  });
};
