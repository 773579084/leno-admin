import { Context } from 'koa'
import { getUserListSer } from '../../service/system/user.service'
import { userType } from '../../types'
import errors from '../../constants/err.type'
const { getUserInfoErr } = errors

class UserController {
  // 获取路由
  async getUserListCon(ctx: Context, next: () => Promise<void>) {
    try {
      const { pageNum, pageSize } = ctx.query as {
        pageNum: string
        pageSize: string
      }
      const res = (await getUserListSer(pageNum, pageSize)) as userType[]

      // 3、返回结果
      ctx.body = {
        code: 200,
        message: '查询用户成功！',
        result: res
      }
    } catch (error) {
      console.error('获取用户列表失败', error)
      return ctx.app.emit('error', getUserInfoErr, ctx)
    }
  }
}

export const { getUserListCon } = new UserController()
