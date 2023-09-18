import { Context } from 'koa';
import errors from '@/app/err.type';
import env from '@/config/default';
import { authWhites } from '@/config';

const { stopEditErr } = errors;

// 禁止操作修改删除类接口（此功能仅用于上线网页预览使用）
export default async (ctx: Context, next: () => Promise<void>) => {
  if (env().STOP_EDIT) {
    const { url, method } = ctx.request;
    const urlList = url.split('/');
    if (!authWhites.includes(url) && method !== 'GET' && !urlList.includes('tool') && url !== '/user/logout') {
      return ctx.app.emit('error', stopEditErr, ctx);
    }
  }
  await next();
};
