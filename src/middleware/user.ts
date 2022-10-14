import { Context } from 'koa'
import { userType } from '../types'
import { getUserInfo } from '../service/user'
import errors from '../constants/err.type'

const { userExisting, userFormatError } = errors

// 判断用户名与密码是否为空
const userValidator = async (ctx: Context, next: any) => {
  const { user_name, password } = ctx.request.body as userType

  // 判断传上来的值是否为空
  if (!user_name || !password) {
    console.error('用户名或密码为空!', ctx.request.body)

    ctx.app.emit('error', userFormatError, ctx)
    return
  }
  await next()
}

// 判断用户名是否重复
const verifyUser = async (ctx: Context, next: any) => {
  const { user_name } = ctx.request.body as userType

  try {
    if (await getUserInfo({ user_name })) {
      console.error('用户名已存在!', ctx.request.body)

      ctx.app.emit('error', userExisting, ctx)
      return
    }
  } catch (error) {
    console.log('获取用户信息错误', error)
    ctx.app.emit('error', userExisting, ctx)
  }
  await next()
}

export { userValidator, verifyUser }
