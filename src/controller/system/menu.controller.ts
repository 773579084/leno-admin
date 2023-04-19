import { Context } from 'koa'

class UserController {
  async menuCon(ctx: Context, next: () => Promise<void>) {
    const responeObj = {
      code: 200,
      message: '操作成功'
    }

    ctx.state.formatData &&
      Object.assign(responeObj, {
        result: ctx.state.formatData
      })
    // 3、返回结果
    ctx.body = responeObj
  }
}

export const { menuCon } = new UserController()
