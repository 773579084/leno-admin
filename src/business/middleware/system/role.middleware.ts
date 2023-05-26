import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType } from '@/types'
import { IroleQueryType, IroleQuerySerType, Irole, IroleSer } from '@/types/system/role'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import { excelBaseStyle } from '@/business/public/excelMap'
import SysRole from '@/mysql/model/system/role.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IroleQueryType
    let newParams = { pageNum, pageSize, del_flag: '0' } as IroleQuerySerType

    params.roleName ? (newParams.role_name = { [Op.like]: params.roleName + '%' }) : null
    params.roleKey ? (newParams.role_key = { [Op.like]: params.roleKey + '%' }) : null
    params.status ? (newParams.status = { [Op.eq]: params.status }) : null
    params.createdAt
      ? (newParams.created_at = {
          [Op.between]: [params.createdAt.beginTime, params.createdAt.endTime]
        })
      : null

    const res = await getListSer<IroleQuerySerType>(SysRole, newParams)

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
    const addContent = ctx.request['body'] as Irole
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')

    await addSer<IroleSer>(SysRole, newAddContent)
    await next()
  } catch (error) {
    console.error('新增用户失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    await putSer<IroleSer>(
      SysRole,
      { role_id: ctx.state.ids },
      { del_flag: '1', update_by: userName }
    )
  } catch (error) {
    console.error('删除用户失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IroleSer>(SysRole, { role_id: ctx.state.ids })

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
    const res = ctx.request['body'] as Irole
    const lineData = await formatHumpLineTransfer(res, 'line')
    const { role_id, ...data } = lineData

    await putSer<IroleSer>(SysRole, { role_id }, { ...data, update_by: userName })

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
    let { id, status } = ctx.request['body'] as { status: string; id: string }

    await putSer<IroleSer>(SysRole, { role_id: id }, { status, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改用户状态失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '角色信息表',
      style: excelBaseStyle,
      headerColumns: [
        { title: '角色名称', dataIndex: 'role_name' },
        { title: '角色权限字符串', dataIndex: 'role_key' },
        { title: '显示顺序', dataIndex: 'role_sort' },
        { title: '部门状态（0正常 1停用）', dataIndex: 'status' },
        { title: '创建时间', dataIndex: 'created_at' }
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
