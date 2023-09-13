import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, addSer, getDetailSer, delSer } from '@/business/service';
import { userType } from '@/types';
import { IoperlogQueryType, IoperlogQuerySerType, IoperlogSer } from '@/types/system/operlog';
import errors from '@/app/err.type';
import { formatHumpLineTransfer } from '@/business/utils';
import { excelJsExport } from '@/business/utils/excel';
import { excelBaseStyle } from '@/business/public/excelMap';
import SysOperLog from '@/mysql/model/system/operlog.model';

const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IoperlogQueryType;
    const newParams = { pageNum, pageSize } as IoperlogQuerySerType;

    if (params.title) newParams.title = { [Op.like]: `${params.title}%` };
    if (params.businessType) newParams.business_type = { [Op.eq]: params.businessType };
    if (params.operName) newParams.oper_name = { [Op.eq]: params.operName };
    if (params.status) newParams.status = { [Op.eq]: params.status };
    if (params.operTime) params.operTime = JSON.parse(params.operTime as unknown as string);
    if (params.operTime) newParams.oper_time = { [Op.between]: [params.operTime.beginTime, params.operTime.endTime] };

    const res = await getListSer<IoperlogQuerySerType>(SysOperLog, newParams);

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
    const addContent = ctx.request.body;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IoperlogSer;

    await addSer<IoperlogSer>(SysOperLog, newAddContent);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 清空
export const cleanMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysOperLog, { oper_id: { [Op.ne]: null } });
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysOperLog, { oper_id: ctx.state.ids });
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IoperlogSer>(SysOperLog, { oper_id: ctx.state.ids });

    ctx.state.formatData = res;
  } catch (error) {
    console.error('详细数据查询错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData;
    const { dicts } = ctx.state;

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '操作日志记录',
      style: excelBaseStyle,
      headerColumns: [
        { title: '日志主键', dataIndex: 'oper_id', width: 80 },
        { title: '模块标题', dataIndex: 'title' },
        { title: '操作类型（0其它 1新增 2修改 3删除）', dataIndex: 'business_type' },
        { title: '操作人员', dataIndex: 'oper_name' },
        { title: '主机地址', dataIndex: 'oper_ip' },
        { title: '操作地点', dataIndex: 'oper_location' },
        { title: '操作状态（0正常 1异常）', dataIndex: 'status' },
        { title: '操作时间', dataIndex: 'oper_time' },
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
