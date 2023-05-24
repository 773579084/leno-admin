import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType} from '@/types'
import {  ILenoUserQueryType, ILenoUserQuerySerType, ILenoUser, ILenoUserSer } from '@/types/system/user'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import {  excelBaseStyle } from '@/business/public/excelMap'
import LenoUser from '@/mysql/model/system/user.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as ILenoUserQueryType
    let newParams = { pageNum, pageSize } as ILenoUserQuerySerType

    params.userId ? newParams.user_id = {[Op.between]: [params.userId.beginTime, params.userId.endTime]} : null
    params.deptId ? (newParams.dept_id = { [Op.like]: params.deptId + "%" }) : null
    params.userName ? (newParams.user_name = { [Op.eq]: params.userName  }) : null
    params.nickName ? (newParams.nick_name = { [Op.eq]: params.nickName  }) : null
    

    const res = await getListSer<ILenoUserQuerySerType>(LenoUser, newParams)

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询字典类型列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as ILenoUser
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')

    await addSer<ILenoUserSer>(LenoUser, newAddContent)
    await next()
  } catch (error) {
    console.error('新增用户失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(LenoUser, { user_id: ctx.state.ids })
  } catch (error) {
    console.error('删除用户失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<ILenoUserSer>(LenoUser, { user_id: ctx.state.ids })

    ctx.state.formatData = res
  } catch (error) {
    console.error('用户个人信息查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 修改
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as ILenoUser
    const lineData = await formatHumpLineTransfer(res, 'line')
    const { user_id, ...data } = lineData

    await putSer<ILenoUserSer>(LenoUser, { user_id }, { ...data, update_by: userName })

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
      sheetName: '用户信息表',
      style: excelBaseStyle,
      headerColumns: [{"title":"用户id","dataIndex":"user_id","width":80},{"title":"部门ID","dataIndex":"dept_id"},{"title":"用户账号","dataIndex":"user_name"},{"title":"用户昵称","dataIndex":"nick_name"},{"title":"用户类型 0 管理员 , 1 非管理员","dataIndex":"user_type"}],
      tableData: list
    })
    ctx.state.buffer = buffer
    await next()
  } catch (error) {
    console.error('导出失败', error)
    return ctx.app.emit('error', exportExcelErr, ctx)
  }
}