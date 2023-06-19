import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType } from '@/types'
import { IjobQueryType, IjobQuerySerType, Ijob, IjobSer } from '@/types/monitor/job'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import { excelBaseStyle } from '@/business/public/excelMap'
import MonitorJob from '@/mysql/model/monitor/job.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IjobQueryType
    let newParams = { pageNum, pageSize } as IjobQuerySerType

    params.jobGroup ? (newParams.job_group = { [Op.eq]: params.jobGroup }) : null
    params.jobName ? (newParams.job_name = { [Op.like]: params.jobName + '%' }) : null
    params.status ? (newParams.status = { [Op.eq]: params.status }) : null

    const res = await getListSer<IjobQuerySerType>(MonitorJob, newParams)

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
    const addContent = ctx.request['body'] as Ijob
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IjobSer

    await addSer<IjobSer>(MonitorJob, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(MonitorJob, { concurrent: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IjobSer>(MonitorJob, { job_id: ctx.state.ids })

    ctx.state.formatData = res
  } catch (error) {
    console.error('详细数据查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 修改
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as Ijob
    const lineData = formatHumpLineTransfer(res, 'line') as IjobSer
    const { concurrent, ...data } = lineData

    await putSer<IjobSer>(MonitorJob, { concurrent }, { ...data, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '定时任务调度表',
      style: excelBaseStyle,
      headerColumns: [
        { title: 'cron执行表达式', dataIndex: 'cron_expression' },
        { title: '调用目标字符串', dataIndex: 'invoke_target' },
        { title: '任务组名', dataIndex: 'job_group' },
        { title: '任务名称', dataIndex: 'job_name' },
        { title: '状态（0正常 1暂停）', dataIndex: 'status' }
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
