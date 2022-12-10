import { Context } from 'koa'
import { getRoutersSer } from '../service/menu.service'

class UserController {
  // 获取路由
  async getRoutersCon(ctx: Context, next: () => Promise<void>) {
    // 获取数据库菜单数据
    const res = await getRoutersSer()

    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '获取路由成功',
      result: res
    }
  }
}

export const { getRoutersCon } = new UserController()
