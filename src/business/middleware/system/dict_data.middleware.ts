import { Context } from 'koa';
import { Op } from 'sequelize';
import { getDataTypeSer } from '@/business/service/system/dict_data.service';
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service';
import { userType, dictDataQueryType, dictDataQuerySerType, IdictData, IdictDataSer } from '@/types';
import errors from '@/app/err.type';
import { formatHumpLineTransfer } from '@/business/utils';
import { excelJsExport } from '@/business/utils/excel';
import { dictDataExcelHeader, excelBaseStyle } from '@/business/public/excelMap';
import SysDictData from '@/mysql/model/system/dict_data.model';

const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as dictDataQueryType;
    const newParams = { pageNum, pageSize } as dictDataQuerySerType;

    if (params.dictLabel) newParams.dict_label = { [Op.like]: `${params.dictLabel}%` };
    if (params.dictType) newParams.dict_type = params.dictType;
    if (params.status) newParams.status = params.status;

    const res = await getListSer<dictDataQuerySerType>(SysDictData, newParams, { otherWhere: { order: [['dict_sort', 'ASC']] } });

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
    const addContent = ctx.request.body as IdictData;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IdictDataSer;

    await addSer<IdictDataSer>(SysDictData, newAddContent);
    await next();
  } catch (error) {
    console.error('新增用户失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysDictData, { dict_code: ctx.state.ids });
  } catch (error) {
    console.error('删除用户失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IdictDataSer>(SysDictData, { dict_code: ctx.state.ids });

    ctx.state.formatData = res;
  } catch (error) {
    console.error('用户个人信息查询错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 根据字典类型查询字典数据信息
export const getDataTypeMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.path.split('/');
    const dictType = list[list.length - 1];
    const res = await getDataTypeSer({ dict_type: dictType });
    ctx.state.formatData = res;
  } catch (error) {
    console.error('字典数据信息查询错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 修改
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const res = ctx.request.body as IdictData;
    const lineData = formatHumpLineTransfer(res, 'line') as IdictDataSer;
    const { dict_code, ...data } = lineData;

    await putSer<IdictDataSer>(SysDictData, { dict_code }, { ...data, update_by: userName });

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
      sheetName: '字典管理数据',
      style: excelBaseStyle,
      headerColumns: dictDataExcelHeader,
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
