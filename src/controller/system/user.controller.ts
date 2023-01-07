import { Context } from 'koa'
import errors from '../../constants/err.type'
import { delUserSer } from '../../service/system/user.service'
const { delUserErr } = errors

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
    try {
      await delUserSer(ctx.state.userId)
      // 3、返回结果
      ctx.body = {
        code: 200,
        message: '删除用户成功！',
        result: ''
      }
    } catch (error) {
      console.error('删除用户失败', error)
      return ctx.app.emit('error', delUserErr, ctx)
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
}

export const { getUserListCon, delUserCon, getdeptTreeCon } = new UserController()
