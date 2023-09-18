import { Context } from 'koa';
import { Op } from 'sequelize';
import { getOptionselectSer } from '@/business/service/system/dict_type.service';
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service';
import { userType, dictTypeQueryType, dictTypeQuerySerType, IdictType, IdictSerType } from '@/types';
import errors from '@/app/err.type';
import { formatHumpLineTransfer } from '@/business/utils';
import { excelJsExport } from '@/business/utils/excel';
import { dictTypeExcelHeader, excelBaseStyle } from '@/business/public/excelMap';
import SysDictType from '@/mysql/model/system/dict_type.model';

const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as dictTypeQueryType;
    const newParams = { pageNum, pageSize } as dictTypeQuerySerType;

    if (params.beginTime) {
      newParams.created_at = { [Op.between]: [params.beginTime, params.endTime] };
    }
    if (params.dictName) newParams.dict_name = { [Op.like]: `${params.dictName}%` };
    if (params.dictType) newParams.dict_type = { [Op.like]: `${params.dictType}%` };
    if (params.status) newParams.status = params.status;

    const res = await getListSer<dictTypeQuerySerType>(SysDictType, newParams);

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询字典类型列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const addContent = ctx.request.body as IdictType;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line');
    await addSer(SysDictType, newAddContent);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysDictType, { dict_id: ctx.state.ids });
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer(SysDictType, { dict_id: ctx.state.ids });
    ctx.state.formatData = res;
  } catch (error) {
    console.error('获取详细数据错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 修改用户
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const res = ctx.request.body as IdictType;
    const newRes = formatHumpLineTransfer(res, 'line') as IdictSerType;
    const { dict_id, ...date } = newRes;

    await putSer(SysDictType, { dict_id }, { ...date, update_by: userName });

    await next();
  } catch (error) {
    console.error('修改失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 获取字典选择框列表
export const getOptionselectMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = (await getOptionselectSer()) as IdictSerType[];

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询字典选择框列表列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData;
    const { dicts } = ctx.state;

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '字典管理数据',
      style: excelBaseStyle,
      headerColumns: dictTypeExcelHeader,
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
