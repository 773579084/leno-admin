import { Context } from 'koa'

export default function errHandlerFn(err: any, ctx: Context) {
  let status = 500
  switch (err.code) {
    case '400':
      status = 400
      break
    case '401':
      status = 401
      break
    case '403':
      status = 403
      break

    default:
      status = 500
      break
  }

  ctx.status = status
  ctx.body = err
}
