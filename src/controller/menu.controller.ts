import { Context } from 'koa'
import { getRoutersSer } from '../service/menu.service'
import { createRouters } from './utils/menu'

class UserController {
  // 获取路由
  async getRoutersCon(ctx: Context, next: () => Promise<void>) {
    const res = await getRoutersSer()
    const resRouters = createRouters(res)

    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '获取路由成功',
      result: resRouters
    }
  }
}

export const { getRoutersCon } = new UserController()
