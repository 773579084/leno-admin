/**
 * 通用返回层
 */
import { Context } from 'koa';
import { writeLog } from '../utils/log';

export default (message?: string) => async (ctx: Context) => {
  try {
    let body = {} as { code: string | number; message: string };
    if (ctx.state.buffer) {
      body = {
        code: 200,
        message: 'buffer',
      };
      ctx.body = ctx.state.buffer;
    } else {
      body = {
        code: 200,
        message: message || '操作成功',
      };
      const repObj = {
        code: 200,
        message: message || '操作成功',
      };
      if (ctx.state.formatData) Object.assign(repObj, { result: ctx.state.formatData });
      ctx.body = repObj;
    }
    // 写入日志
    writeLog('0', ctx, body);
  } catch (error) {
    console.error('返回层失败', error);
    return ctx.app.emit('error', {}, ctx);
  }
};
