import { Context } from 'koa'
import { getListSer, delSer, addAllSer } from '@/business/service'
import {
  IroleUserQueryType,
  IroleUserQuerySerType,
  IaddUserRoleType
} from '@/types/system/roleUser'
import errors from '@/app/err.type'
import LenoUser from '@/mysql/model/user.model'
import { Op } from 'sequelize'
import SysUserRole from '@/mysql/model/system/sys_user_role.model'
const { uploadParamsErr, getListErr, delErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IroleUserQueryType
    let newParams = { pageNum, pageSize } as IroleUserQuerySerType

    params.userName ? (newParams.user_name = { [Op.like]: params.userName + '%' }) : null
    params.phonenumber ? (newParams.phonenumber = { [Op.like]: params.phonenumber + '%' }) : null

    const res = await getListSer<IroleUserQuerySerType>(LenoUser, newParams)

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
    const data = ctx.request['body'] as IaddUserRoleType

    const addRoleUser = []
    data.userId.split(',').forEach((id) => {
      addRoleUser.push({
        role_id: data.roleId,
        user_id: id
      })
    })

    await addAllSer(SysUserRole, addRoleUser)
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
