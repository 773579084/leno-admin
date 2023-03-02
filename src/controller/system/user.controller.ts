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
  // 岗位及角色数据获取
  async getPostRoleCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '获取岗位、角色成功！',
      result: ctx.state.formatData
    }
  }

  // 新增用户
  async getAddUserCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '新增用户成功！',
      result: ctx.state.formatData
    }
  }

  // 修改用户密码
  async updatePwdCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '用户密码修改成功！',
      result: ''
    }
  }

  // 获取用户个人详细数据
  async userInfoCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '用户个人信息获取成功！',
      result: ctx.state.formatData
    }
  }

  // 修改用户信息
  async putUserCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '修改用户成功！',
      result: ctx.state.formatData
    }
  }

  // 修改用户信息
  async putUserStatusCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: ctx.state.status === '0' ? '用户启用成功！' : '用户停用成功！',
      result: ''
    }
  }
}

export const {
  getUserListCon,
  delUserCon,
  getdeptTreeCon,
  getAddUserCon,
  getPostRoleCon,
  updatePwdCon,
  userInfoCon,
  putUserCon,
  putUserStatusCon
} = new UserController()
