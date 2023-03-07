import { Context } from 'koa'
import { delUserSer } from '@/service/system/user.service'
import xlsx from 'node-xlsx'
import errors from '@/constants/err.type'
import { flatten } from '@/utils'
const { delUserErr, delSuperUserErr } = errors

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
    if (ctx.state.userId.some((value) => value === '1')) {
      console.log(20, ctx.state.userId)
      ctx.app.emit('error', delSuperUserErr, ctx)
    } else {
      try {
        await delUserSer(ctx.state.userId)
      } catch (error) {
        console.error('删除用户失败', error)
        return ctx.app.emit('error', delUserErr, ctx)
      }
      // 3、返回结果
      ctx.body = {
        code: 200,
        message: '删除用户成功！',
        result: ''
      }
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

  // 导出用户列表
  async exportUserListCon(ctx: Context, next: () => Promise<void>) {
    const users = ctx.state.formatData
    // 处理数据返回excel
    // 设置表头
    const header = [
      '用户序号',
      '用户名称',
      '用户邮箱',
      '手机号码',
      '用户性别',
      '帐号状态',
      '最后登录IP',
      '最后登录时间',
      '部门名称',
      '部门负责人'
    ]
    const headerKeys = [
      'userId',
      'userName',
      'email',
      'phonenumber',
      'sex',
      'status',
      'loginIp',
      'loginDate',
      'dept.deptName',
      'dept.leader'
    ]
    // 表格数据
    const data = []
    users.forEach((item) => {
      let arr = []
      const item2 = flatten(item)
      headerKeys.forEach((key) => {
        arr.push(item2[key])
      })
      data.push(arr)
    })
    data.unshift(header)
    const buffer = xlsx.build([{ options: {}, name: `user_${new Date().valueOf()}`, data: data }])

    // 3、返回结果
    ctx.body = buffer
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
  putUserStatusCon,
  exportUserListCon
} = new UserController()
