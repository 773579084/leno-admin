import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service';
import { userType } from '@/types';
import { InoticeQueryType, InoticeQuerySerType, Inotice, InoticeSer } from '@/types/system/notice';
import errors from '@/app/err.type';
import { formatHumpLineTransfer, removeSpecifyFile } from '@/business/utils';
import SysNotice from '@/mysql/model/system/notice.model';

const { uploadParamsErr, getListErr, sqlErr, delErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as InoticeQueryType;
    const newParams = { pageNum, pageSize } as InoticeQuerySerType;

    if (params.noticeTitle) newParams.notice_title = { [Op.like]: `${params.noticeTitle}%` };
    if (params.createBy) newParams.create_by = { [Op.like]: `${params.createBy}%` };

    const res = await getListSer<InoticeQuerySerType>(SysNotice, newParams);

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const addContent = ctx.request.body as Inotice;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as InoticeSer;

    await addSer<InoticeSer>(SysNotice, newAddContent);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 拿取图片信息，有则删除
    const { imgs } = await getDetailSer<InoticeSer>(SysNotice, { notice_id: ctx.state.ids });
    if (imgs) {
      JSON.parse(imgs).forEach((item: string) => removeSpecifyFile(item));
    }

    await delSer(SysNotice, { notice_id: ctx.state.ids });
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<InoticeSer>(SysNotice, { notice_id: ctx.state.ids });

    ctx.state.formatData = res;
  } catch (error) {
    console.error('详细数据查询错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 修改
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const res = ctx.request.body as Inotice;
    const lineData = formatHumpLineTransfer(res, 'line') as InoticeSer;
    const { notice_id, ...data } = lineData;

    await putSer<InoticeSer>(SysNotice, { notice_id }, { ...data, update_by: userName });

    await next();
  } catch (error) {
    console.error('修改失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};
