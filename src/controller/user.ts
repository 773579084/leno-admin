import { Context } from 'koa'
import { createdUser } from '../service/user'
import { userType } from '../types'

class UserController {
  async register(ctx: Context, next: any) {
    // 1、获取数据
    const { user_name, password } = ctx.request.body as userType

    // 2、操作数据库
    const res = await createdUser(user_name as string, password as string)

    // 3、返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name
      }
    }
  }

  async login(ctx: Context, next: any) {
    ctx.body = 'register'
  }
}

const { login, register } = new UserController()

export { login, register }
