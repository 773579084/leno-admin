import { Context } from 'koa'
import { delUserSer } from '@/service/system/user.service'
import errors from '@/constants/err.type'
const { delUserErr, delSuperUserErr } = errors
import { excelExportMap, excelBaseStyle, templateHeader } from '@/public/map'
import { excelExport, excelJsExport } from '@/utils'

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
    // 表格数据
    const buffer = excelExport(
      users,
      excelExportMap.userHeader,
      excelExportMap.userHeaderKeys,
      'user'
    )
    // 3、返回结果
    ctx.body = buffer
  }

  // 导出用户excel模板
  async exportTemlateCon(ctx: Context, next: () => Promise<void>) {
    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '用户数据',
      style: excelBaseStyle,
      headerColumns: templateHeader,
      tableData: []
    })
    console.log(133, buffer)

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
  exportUserListCon,
  exportTemlateCon
} = new UserController()
