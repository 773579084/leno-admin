import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, getDetailSer, delSer } from '@/business/service';
import { IlogininforQueryType, IlogininforQuerySerType, IlogininforSer } from '@/types/system/logininfor';
import errors from '@/app/err.type';
import { excelJsExport } from '@/business/utils/excel';
import { excelBaseStyle } from '@/business/public/excelMap';
import SysLogininfor from '@/mysql/model/system/logininfor.model';

const { getListErr, sqlErr, delErr, exportExcelErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IlogininforQueryType;
    const newParams = { pageNum, pageSize } as IlogininforQuerySerType;

    if (params.userName) newParams.user_name = { [Op.like]: params.userName };
    if (params.ipaddr) newParams.ipaddr = { [Op.like]: params.ipaddr };
    if (params.status) newParams.status = { [Op.eq]: params.status };
    if (params.loginTime) params.loginTime = JSON.parse(params.loginTime as unknown as string);
    if (params.loginTime) newParams.login_time = { [Op.between]: [params.loginTime.beginTime, params.loginTime.endTime] };

    const res = await getListSer<IlogininforQuerySerType>(SysLogininfor, newParams);

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysLogininfor, { info_id: ctx.state.ids });
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 清空
export const cleanMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysLogininfor, { info_id: { [Op.ne]: null } });
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IlogininforSer>(SysLogininfor, { info_id: ctx.state.ids });

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
      sheetName: '登录日志',
      style: excelBaseStyle,
      headerColumns: [
        { title: '访问ID', dataIndex: 'info_id', width: 80 },
        { title: '用户账号', dataIndex: 'user_name' },
        { title: '登录IP地址', dataIndex: 'ipaddr' },
        { title: '登录地点', dataIndex: 'login_location' },
        { title: '浏览器类型', dataIndex: 'browser' },
        { title: '操作系统', dataIndex: 'os' },
        { title: '登录状态（0成功 1失败）', dataIndex: 'status' },
        { title: '提示消息', dataIndex: 'msg' },
        { title: '访问时间', dataIndex: 'login_time' },
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
