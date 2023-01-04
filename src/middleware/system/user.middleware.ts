import { Context } from 'koa'
import { getUserListSer } from '../../service/system/user.service'
import { userType } from '../../types'
import errors from '../../constants/err.type'
const { getUserInfoErr } = errors

// 生成用户列表
const getUserListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize } = ctx.query as {
      pageNum: string
      pageSize: string
    }
    ctx.state.formatData = (await getUserListSer(pageNum, pageSize)) as userType[]
    await next()
  } catch (error) {
    console.error('获取用户列表失败', error)
    return ctx.app.emit('error', getUserInfoErr, ctx)
  }
}

export { getUserListMid }
