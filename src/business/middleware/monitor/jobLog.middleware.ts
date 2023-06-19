import { Context } from 'koa'
import { getListSer, addSer, getDetailSer, delSer } from '@/business/service'
import { userType } from '@/types'
import { IjobLogQueryType, IjobLogQuerySerType, IjobLog, IjobLogSer } from '@/types/monitor/jobLog'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import { excelBaseStyle } from '@/business/public/excelMap'
import MonitorJobLog from '@/mysql/model/monitor/jobLog.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IjobLogQueryType
    let newParams = { pageNum, pageSize } as IjobLogQuerySerType

    params.jobGroup ? (newParams.job_group = { [Op.eq]: params.jobGroup }) : null
    params.jobName ? (newParams.job_name = { [Op.like]: params.jobName + '%' }) : null
    params.status ? (newParams.status = { [Op.eq]: params.status }) : null
    if (params.createdAt) params.createdAt = JSON.parse(params.createdAt as unknown as string)
    params.createdAt
      ? (newParams.created_at = {
          [Op.between]: [params.createdAt.beginTime, params.createdAt.endTime]
        })
      : null

    const res = await getListSer<IjobLogQuerySerType>(MonitorJobLog, newParams)

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as IjobLog
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IjobLogSer

    await addSer<IjobLogSer>(MonitorJobLog, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(MonitorJobLog, { job_log_id: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '定时任务调度日志表',
      style: excelBaseStyle,
      headerColumns: [
        { title: '调用目标字符串', dataIndex: 'invoke_target' },
        { title: '任务组名', dataIndex: 'job_group' },
        { title: '日志信息', dataIndex: 'job_message' },
        { title: '任务名称', dataIndex: 'job_name' },
        { title: '执行状态（0正常 1失败）', dataIndex: 'status' },
        { title: '执行时间', dataIndex: 'created+at' }
      ],
      tableData: list
    })
    ctx.state.buffer = buffer
    await next()
  } catch (error) {
    console.error('导出失败', error)
    return ctx.app.emit('error', exportExcelErr, ctx)
  }
}
