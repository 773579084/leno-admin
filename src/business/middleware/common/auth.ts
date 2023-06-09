import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import errors from '@/app/err.type'
import dayjs from 'dayjs'
import { IuserTokenType } from '@/types/auth'
import { judgeKeyOverdue, removeKey } from '@/business/utils/auth'
const { invalidToken } = errors
const { JWT_SECRET } = process.env

const auth = async (ctx: Context, next: () => Promise<void>) => {
  const { authorization = '' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')

  if (ctx.request.url !== '/user/login' && ctx.request.url !== '/user/register') {
    // user中包含了payload的信息(userId, userName)
    const user = jwt.verify(token, JWT_SECRET) as IuserTokenType
    console.log(16, user)

    // 查询 sessionId 过期了没
    if (!(await judgeKeyOverdue(user.session))) {
      // 删除 login_tokens 集合中的过期key
      removeKey(user.session)
      console.error('token 过期')
      return ctx.app.emit('error', invalidToken, ctx)
    }

    ctx.state.user = user
  }

  await next()
}

export default auth
