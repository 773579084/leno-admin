import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import env from '@/config/config.default'
import errors from '@/constants/err.type'
import dayjs from 'dayjs'
const { invalidToken } = errors

const auth = async (ctx: Context, next: () => Promise<void>) => {
  const { authorization = '' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')

  try {
    // user中包含了payload的信息(userId, userName)
    const user = jwt.verify(token, env.JWT_SECRET)

    if (dayjs().isAfter(user.exp)) {
      console.error('token 过期')
      return ctx.app.emit('error', invalidToken, ctx)
    }

    ctx.state.user = user
  } catch (error) {
    switch (error.name) {
      default:
        console.error('无效的token', error)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }

  await next()
}

export default auth
