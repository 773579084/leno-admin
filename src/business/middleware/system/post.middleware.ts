import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, addSer, putSer, getDetailSer } from '@/business/service';
import { userType } from '@/types';
import { IpostQueryType, IpostQuerySerType, Ipost, IpostSer } from '@/types/system/post';
import errors from '@/app/err.type';
import { formatHumpLineTransfer } from '@/business/utils';
import { excelJsExport } from '@/business/utils/excel';
import { excelBaseStyle } from '@/business/public/excelMap';
import SysPost from '@/mysql/model/system/post.model';
import { bindCheck } from '@/business/utils/bind';
import SysUserPost from '@/mysql/model/system/sys_user_post.model';

const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IpostQueryType;
    const newParams = { pageNum, pageSize } as IpostQuerySerType;

    if (params.postCode) newParams.post_code = { [Op.like]: `${params.postCode}%` };
    if (params.postName) newParams.post_name = { [Op.like]: `${params.postName}%` };
    if (params.status) newParams.status = { [Op.eq]: params.status };
    newParams.del_flag = { [Op.eq]: '0' };

    const res = await getListSer<IpostQuerySerType>(SysPost, newParams);

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
    const addContent = ctx.request.body as Ipost;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IpostSer;

    await addSer<IpostSer>(SysPost, newAddContent);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    if ((await bindCheck(SysUserPost, { post_id: ctx.state.ids })).length > 0) {
      ctx.body = {
        code: 500,
        message: '岗位已被分配,不允许删除',
      };
    } else {
      await putSer(SysPost, { post_id: ctx.state.ids }, { del_flag: '2' });
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
    const res = await getDetailSer<IpostSer>(SysPost, { post_id: ctx.state.ids });

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
    const res = ctx.request.body as Ipost;
    const lineData = formatHumpLineTransfer(res, 'line') as IpostSer;
    const { post_id, ...data } = lineData;

    await putSer<IpostSer>(SysPost, { post_id }, { ...data, update_by: userName });

    await next();
  } catch (error) {
    console.error('修改失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData;
    const { dicts } = ctx.state;

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '岗位信息表',
      style: excelBaseStyle,
      headerColumns: [
        { title: '岗位编码', dataIndex: 'post_code' },
        { title: '岗位名称', dataIndex: 'post_name' },
        { title: '显示顺序', dataIndex: 'post_sort' },
        { title: '岗位状态（0正常 1停用）', dataIndex: 'status' },
        { title: '创建时间', dataIndex: 'created_at' },
      ],
      tableData: list,
      dicts,
    });
    ctx.state.buffer = buffer;
    await next();
  } catch (error) {
    console.error('导出失败', error);
    return ctx.app.emit('error', exportExcelErr, ctx);
  }
};
