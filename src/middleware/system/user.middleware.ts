import { Context } from 'koa'
import { getUserListSer } from '../../service/system/user.service'
import { userType } from '../../types'
import errors from '../../constants/err.type'
import { userIdSchema } from '../../schema/system/sys.user.schema'
const { getUserListErr } = errors

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
    return ctx.app.emit('error', getUserListErr, ctx)
  }
}

// 判断用户名id是否正确
// const userIdSchema = async (ctx: Context, next: () => Promise<void>) => {
//   const list = ctx.request.path.split('/')
//   const userId = list[list.length - 1]

//   try {
//     await userIdSchema.validateAsync({ userName, password })
//   } catch (error) {
//     console.error('用户名或密码格式错误!', ctx.request.body)
//     return ctx.app.emit('error', FormatWrongErr, ctx)
//   }
//   await next()
// }

export { getUserListMid }
