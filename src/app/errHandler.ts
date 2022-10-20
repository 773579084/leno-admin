import { Context } from 'koa'

export default function errHandlerFn(err: any, ctx: Context) {
  let status = 500
  switch (err.code) {
    case '10001':
      status = 400
      break
    case '10002':
      status = 409
      break

    default:
      status = 500
      break
  }

  ctx.status = status
  ctx.body = err
}
