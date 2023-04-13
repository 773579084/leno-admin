import { Context } from 'koa'

class UserController {
  // 获取路由
  async getRoutersCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '获取路由成功',
      result: ctx.state.routers
    }
  }
}

export const { getRoutersCon } = new UserController()
