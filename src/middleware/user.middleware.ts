import { Context } from 'koa'
import { userType, pwdType } from '../types'
import { getUserInfo } from '../service/user.service'
import errors from '../constants/err.type'
import bcrypt from 'bcryptjs'
import { loginSchema, resetPwdSchema, changeUserInfoSchema } from '../schema/user.schema'

const {
  userExisting,
  userLoginError,
  userDoesNotExist,
  userRegisterError,
  FormatWrongErr,
  InvalidConnectionError
} = errors

// 判断用户名与密码是否为空
const userSchema = async (ctx: Context, next: () => Promise<void>) => {
  const { user_name, password } = ctx.request.body as userType

  try {
    await loginSchema.validateAsync({ user_name, password })
  } catch (error) {
    console.error('用户名或密码格式错误!', ctx.request.body)
    return ctx.app.emit('error', FormatWrongErr, ctx)
  }
  await next()
}

// 判断用户名是否重复
const verifyUser = async (ctx: Context, next: () => Promise<void>) => {
  const { user_name } = ctx.request.body as userType

  try {
    if (await getUserInfo({ user_name })) {
      console.error('用户名已存在!', ctx.request.body)

      ctx.app.emit('error', userExisting, ctx)
      return
    }
  } catch (error) {
    console.error('获取用户信息错误', error)
    ctx.app.emit('error', userRegisterError, ctx)
  }
  await next()
}

// 用户密码加密中间件
const crptyPassword = async (ctx: Context, next: () => Promise<void>) => {
  const { password } = ctx.request.body as userType

  const salt = bcrypt.genSaltSync(10)

  const hash = bcrypt.hashSync(password as string, salt)

  ctx.request.body.password = hash

  await next()
}

// 判断用户是否存在，密码是否匹配
const loginValidator = async (ctx: Context, next: () => Promise<void>) => {
  const { user_name, password } = ctx.request.body as userType

  try {
    // 检查是否有重复的用户名，如果有返回 查询到的数据
    const res = await getUserInfo({ user_name })

    if (!res) {
      console.error('用户名不存在', { user_name })
      ctx.app.emit('error', userDoesNotExist, ctx)
      return
    }

    // 判断密码是否匹配
    if (!bcrypt.compareSync(password as string, res.password)) {
      console.error('密码错误')
      ctx.app.emit('error', InvalidConnectionError, ctx)
      return
    }
  } catch (error) {
    console.error(error)
    return ctx.app.emit('error', userLoginError, ctx)
  }

  await next()
}

// 判断新旧密码 格式是否正确
const pwdSchema = async (ctx: Context, next: () => Promise<void>) => {
  const { oldPwd, newPwd } = ctx.request.body as pwdType

  try {
    await resetPwdSchema.validateAsync({ oldPwd, newPwd })
  } catch (error) {
    console.error('账号密码格式不对!', ctx.request.body)
    return ctx.app.emit('error', FormatWrongErr, ctx)
  }
  await next()
}

// 检查 用户昵称 手机号码 邮箱 是否为空
const userInfoSchema = async (ctx: Context, next: () => Promise<void>) => {
  const { email, phonenumber, nick_name, sex = 0 } = ctx.request.body as userType

  try {
    await changeUserInfoSchema.validateAsync({
      email,
      phonenumber,
      nick_name,
      sex
    })
  } catch (error) {
    console.error('用户昵称、手机号码或邮箱格式不正确!', error)
    return ctx.app.emit('error', FormatWrongErr, ctx)
  }
  await next()
}

export { userSchema, verifyUser, crptyPassword, loginValidator, pwdSchema, userInfoSchema }
