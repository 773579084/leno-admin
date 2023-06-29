import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import errors from '@/app/err.type'
import { IuserTokenType } from '@/types/auth'
import { judgeKeyOverdue, queryKeyValue, removeListKey, resetTime } from '@/business/utils/auth'
const { invalidToken, accessAuthErr } = errors
const { JWT_SECRET } = process.env
import { authWhites } from '@/config'

// 权限过期判断
export const auth = async (ctx: Context, next: () => Promise<void>) => {
  const { authorization = '' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')

  // 权限白名单
  if (!authWhites.includes(ctx.request.url)) {
    // user中包含了payload的信息(userId, userName)
    const user = jwt.verify(token, JWT_SECRET) as IuserTokenType

    // 查询 sessionId 过期了没
    if (!(await judgeKeyOverdue(user.session))) {
      // 删除 login_tokens 集合中的过期key
      removeListKey([user.session])
      console.error('token 过期')
      return ctx.app.emit('error', invalidToken, ctx)
    } else {
      // 重新刷新过期事件
      resetTime(user.session)
    }

    ctx.state.user = user
  }

  await next()
}

/**
 * 权限字符判断
 * @param permi
 * @returns
 */
export const hasPermi = (permi: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const { session } = ctx.state.user
    const { permissions } = await queryKeyValue(session)

    if (permissions[0] !== '*:*:*') {
      if (!permissions.includes(permi)) {
        console.error('无访问权限')
        return ctx.app.emit('error', accessAuthErr, ctx)
      }
    }

    await next()
  }
}
