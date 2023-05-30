import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType } from '@/types'
import { IdeptQueryType, IdeptQuerySerType, Idept, IdeptSer } from '@/types/system/dept'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import SysDept from '@/mysql/model/system/dept.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IdeptQueryType
    let newParams = { pageNum, pageSize } as IdeptQuerySerType

    params.deptName ? (newParams.dept_name = { [Op.like]: params.deptName + '%' }) : null
    params.status ? (newParams.status = { [Op.eq]: params.status }) : null

    const res = await getListSer<IdeptQuerySerType>(SysDept, newParams)

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
    const addContent = ctx.request['body'] as Idept
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')

    await addSer<IdeptSer>(SysDept, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysDept, { dept_id: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IdeptSer>(SysDept, { dept_id: ctx.state.ids })

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
    const res = ctx.request['body'] as Idept
    const lineData = await formatHumpLineTransfer(res, 'line')
    const { dept_id, ...data } = lineData

    await putSer<IdeptSer>(SysDept, { dept_id }, { ...data, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}
