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
import { addEditJob, cancelJob, runOneJob, scheduleAll } from '@/business/utils/job'
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

    const { job_id } = await addSer<IjobSer>(MonitorJob, newAddContent)

    if (addContent.status === '0') {
      switch (addContent.misfirePolicy) {
        case '1':
          // 新增定时任务 立即执行
          addEditJob(`${job_id}`, addContent.cronExpression, addContent.invokeTarget)
          break
        case '2':
          // 仅执行一次
          runOneJob(addContent.invokeTarget)
          break
        default:
          break
      }
    }

    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const ids = ctx.state.ids as string[]
    await delSer(MonitorJob, { job_id: ids })

    // 取消 定时任务
    ids.forEach((id) => {
      cancelJob(id)
    })
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
    const { job_id, ...data } = lineData

    await putSer<IjobSer>(MonitorJob, { job_id }, { ...data, update_by: userName })

    if (res.status === '0') {
      switch (res.misfirePolicy) {
        case '1':
          // 新增定时任务 立即执行
          addEditJob(`${job_id}`, res.cronExpression, 'addEditFn')
          break
        case '2':
          // 仅执行一次
          runOneJob('runOneFn')
          break
        default:
          break
      }
    }

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 修改用户状态
export const putRoleStatusMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    let { jobId, status } = ctx.request['body'] as { status: string; jobId: number }

    await putSer<IjobSer>(MonitorJob, { job_id: jobId }, { status, update_by: userName })

    const res = await getDetailSer<IjobSer>(MonitorJob, { job_id: jobId })

    if (res.status === '0') {
      // 新建定时任务
      addEditJob(`${res.job_id}`, res.cron_expression, res.invoke_target)
    } else {
      // 删除定时任务
      cancelJob(`${res.job_id}`)
    }

    await next()
  } catch (error) {
    console.error('修改角色状态失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 立即执行一次
export const jobRunOneMid = async (ctx: Context, next: () => Promise<void>) => {
  let { jobId } = ctx.request['body'] as { jobId: number }
  const res = await getDetailSer<IjobSer>(MonitorJob, { job_id: jobId })
  runOneJob(res.invoke_target)
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
