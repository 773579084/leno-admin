import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, addSer, putSer, getDetailSer } from '@/business/service';
import { userType } from '@/types';
import { IdeptQueryType, IdeptQuerySerType, Idept, IdeptSer } from '@/types/system/dept';
import errors from '@/app/err.type';
import { formatHumpLineTransfer } from '@/business/utils';
import SysDept from '@/mysql/model/system/dept.model';
import LenoUser from '@/mysql/model/user.model';
import { bindCheck } from '@/business/utils/bind';

const { uploadParamsErr, getListErr, sqlErr, delErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IdeptQueryType;
    const newParams = { pageNum, pageSize } as IdeptQuerySerType;

    if (params.deptName) newParams.dept_name = { [Op.like]: `${params.deptName}%` };
    if (params.deptName) newParams.status = { [Op.eq]: params.status };
    newParams.del_flag = { [Op.eq]: '0' };

    const res = await getListSer<IdeptQuerySerType>(SysDept, newParams);

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
    const addContent = ctx.request.body as Idept;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IdeptSer;

    await addSer<IdeptSer>(SysDept, newAddContent);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    if ((await bindCheck(LenoUser, { dept_id: ctx.state.ids })).length > 0) {
      ctx.body = {
        code: 500,
        message: '部门存在用户,不允许删除',
      };
    } else {
      await putSer(SysDept, { dept_id: ctx.state.ids }, { del_flag: '2' });
      await next();
    }
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IdeptSer>(SysDept, { dept_id: ctx.state.ids });

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
    const res = ctx.request.body as Idept;
    const lineData = formatHumpLineTransfer(res, 'line') as IdeptSer;
    const { dept_id, ...data } = lineData;

    await putSer<IdeptSer>(SysDept, { dept_id }, { ...data, update_by: userName });

    await next();
  } catch (error) {
    console.error('修改失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};
