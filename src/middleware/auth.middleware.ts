import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import env from '../config/config.default'
import errors from '../constants/err.type'
const { tokenExpiredError, invalidToken } = errors

const auth = async (ctx: Context, next: () => Promise<void>) => {
  const { authorization = '' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')

  try {
    // user中包含了payload的信息(id, user_name)
    const user = jwt.verify(token, env.JWT_SECRET)
    ctx.state.user = user
  } catch (error) {
    switch (error.name) {
      case 'tokenExpiredError':
        console.error('token已过期', error)
        return ctx.app.emit('error', tokenExpiredError, ctx)

      default:
        console.error('无效的token', error)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }

  await next()
}

export default auth
