import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType } from '@/types'
import { InoticeQueryType, InoticeQuerySerType, Inotice, InoticeSer } from '@/types/system/notice'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import { excelBaseStyle } from '@/business/public/excelMap'
import SysNotice from '@/mysql/model/system/notice.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as InoticeQueryType
    let newParams = { pageNum, pageSize } as InoticeQuerySerType

    params.noticeTitle ? (newParams.notice_title = { [Op.like]: params.noticeTitle + '%' }) : null
    params.createBy ? (newParams.create_by = { [Op.like]: params.createBy + '%' }) : null

    const res = await getListSer<InoticeQuerySerType>(SysNotice, newParams)

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
    const addContent = ctx.request['body'] as Inotice
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')

    await addSer<InoticeSer>(SysNotice, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysNotice, { notice_id: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<InoticeSer>(SysNotice, { notice_id: ctx.state.ids })

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
    const res = ctx.request['body'] as Inotice
    const lineData = await formatHumpLineTransfer(res, 'line')
    const { notice_id, ...data } = lineData

    await putSer<InoticeSer>(SysNotice, { notice_id }, { ...data, update_by: userName })

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
      sheetName: '通知公告表',
      style: excelBaseStyle,
      headerColumns: [
        { title: '公告标题', dataIndex: 'notice_title' },
        { title: '公告类型（1通知 2公告）', dataIndex: 'notice_type' },
        { title: '公告状态（0正常 1关闭）', dataIndex: 'status' },
        { title: '创建者', dataIndex: 'create_by' },
        { title: '创建时间', dataIndex: ' created_at' }
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
