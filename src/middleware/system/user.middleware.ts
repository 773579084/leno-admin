import { Context } from 'koa'
import { getUserListSer, getdeptTreeSer } from '../../service/system/user.service'
import { userListType } from '../../types'
import errors from '../../constants/err.type'
import { userIdJudge } from '../../schema/system/sys.user.schema'
import Dept from '../../model/system/dept.model'
const { getUserListErr, checkUserIdErr, getDeptTreeErr } = errors

// 生成用户列表
const getUserListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize } = ctx.query as {
      pageNum: string
      pageSize: string
    }
    const res = (await getUserListSer(pageNum, pageSize)) as userListType

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('获取用户列表失败', error)
    return ctx.app.emit('error', getUserListErr, ctx)
  }
}

// 判断用户名id是否正确
const userIdSchema = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.path.split('/')
    const userId = list[list.length - 1]
    await userIdJudge.validateAsync({ userId })
    ctx.state.userId = userId
  } catch (error) {
    console.error('用户名id格式错误!', ctx.request.body)
    return ctx.app.emit('error', checkUserIdErr, ctx)
  }
  await next()
}

// 查询部门下拉树结构
const deptTreeMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getdeptTreeSer()

    ctx.state.formatData = res
  } catch (error) {
    console.error('查询部门失败!', ctx.request.body)
    return ctx.app.emit('error', getDeptTreeErr, ctx)
  }
  await next()
}

export { getUserListMid, userIdSchema, deptTreeMid }
