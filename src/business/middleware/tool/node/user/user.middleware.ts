import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType} from '@/types'
import {  IuserQueryType, IuserQuerySerType, Iuser, IuserSer } from '@/types/system/user'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import {  excelBaseStyle } from '@/business/public/excelMap'
import LenoUser from '@/mysql/model/system/user.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr} = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IuserQueryType
    let newParams = { pageNum, pageSize } as IuserQuerySerType
    
    const res = await getListSer<IuserQuerySerType>(LenoUser, newParams)

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
    const addContent = ctx.request['body'] as Iuser
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as  IuserSer

    await addSer<IuserSer>(LenoUser, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {

    await delSer(LenoUser, { user_id: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IuserSer>(LenoUser, { user_id: ctx.state.ids }: ctx.state.ids })

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
    const res = ctx.request['body'] as Iuser
    const lineData =  formatHumpLineTransfer(res, 'line') as IuserSer
    const { user_id: ctx.state.ids }, ...data } = lineData

    await putSer<IuserSer>(LenoUser, { user_id: ctx.state.ids }}, { ...data, update_by: userName })

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
    const dicts = ctx.state.dicts

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '用户信息表',
      style: excelBaseStyle,
      headerColumns: [],
      tableData: list,
      dicts: dicts
    })
    ctx.state.buffer = buffer
    await next()
  } catch (error) {
    console.error('导出失败', error)
    return ctx.app.emit('error', exportExcelErr, ctx)
  }
}