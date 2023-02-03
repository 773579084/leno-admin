import { Context } from 'koa'
import { delUserSer } from '@/service/system/user.service'

class UserController {
  // 生成用户列表
  async getUserListCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '查询用户成功！',
      result: ctx.state.formatData
    }
  }

  // 删除用户
  async delUserCon(ctx: Context, next: () => Promise<void>) {
    await delUserSer(ctx.state.userId)
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '删除用户成功！',
      result: ''
    }
  }

  // 查询部门下拉树结构
  async getdeptTreeCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '查询部门成功！',
      result: ctx.state.formatData
    }
  }

  // 新增用户
  async addUserCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '操作成功！',
      result: ctx.state.formatData
    }
  }
}

export const { getUserListCon, delUserCon, getdeptTreeCon, addUserCon } = new UserController()
