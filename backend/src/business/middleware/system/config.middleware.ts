import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, addSer, putSer, getDetailSer, delSer, queryConditionsData } from '@/business/service';
import { userType } from '@/types';
import { IconfigQueryType, IconfigQuerySerType, Iconfig, IconfigSer } from '@/types/system/config';
import errors from '@/app/err.type';
import { formatHumpLineTransfer } from '@/business/utils';
import { excelJsExport } from '@/business/utils/excel';
import { excelBaseStyle } from '@/business/public/excelMap';
import SysConfig from '@/mysql/model/system/config.model';

const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IconfigQueryType;
    const newParams = { pageNum, pageSize } as IconfigQuerySerType;
    if (params.configName) newParams.config_name = { [Op.like]: `${params.configName}%` };
    if (params.configKey) newParams.config_key = { [Op.like]: `${params.configKey}%` };
    if (params.configType) newParams.config_type = { [Op.eq]: params.configType };
    if (params.createdAt) params.createdAt = JSON.parse(params.createdAt as unknown as string);
    if (params.createdAt) newParams.created_at = { [Op.between]: [params.createdAt.beginTime, params.createdAt.endTime] };

    const res = await getListSer<IconfigQuerySerType>(SysConfig, newParams);

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 根据参数键名查询参数值
export const getConfigKeyMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { key } = ctx.request.body;
    const res = (await queryConditionsData(SysConfig, { config_key: key })) as IconfigSer;
    ctx.state.formatData = res[0].config_value;
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
    const addContent = ctx.request.body as Iconfig;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IconfigSer;

    await addSer<IconfigSer>(SysConfig, newAddContent);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysConfig, { config_id: ctx.state.ids });
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IconfigSer>(SysConfig, { config_id: ctx.state.ids });

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
    const res = ctx.request.body as Iconfig;
    const lineData = formatHumpLineTransfer(res, 'line') as IconfigSer;
    const { config_id, ...data } = lineData;

    await putSer<IconfigSer>(SysConfig, { config_id }, { ...data, update_by: userName });

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
      sheetName: '参数配置表',
      style: excelBaseStyle,
      headerColumns: [
        { title: '参数名称', dataIndex: 'config_name' },
        { title: '参数键名', dataIndex: 'config_key' },
        { title: '参数键值', dataIndex: 'config_value' },
        { title: '系统内置（Y是 N否）', dataIndex: 'config_type' },
        { title: '创建时间', dataIndex: 'created_at' },
        { title: '备注', dataIndex: 'remark' },
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
