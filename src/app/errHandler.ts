import { Context } from 'koa';
import { writeLog } from '@/business/utils/log';

export default function errHandlerFn(err: any, ctx: Context) {
  // 失败日志采集
  writeLog('1', ctx, err);

  /** code 代表含义
   * 400 => 表示前端传参可能出现错误
   * 401 => 权限过期
   * 403 => 无访问权限
   * 500 => 服务器拒绝请求
   */
  let status = 500;
  switch (err.code) {
    case '400':
      status = 400;
      break;
    case '401':
      status = 401;
      break;
    case '403':
      status = 403;
      break;

    default:
      status = 500;
      break;
  }

  ctx.status = status;
  ctx.body = err;
}
