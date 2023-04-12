import { Context } from 'koa'
import { delUserSer } from '@/service/system/user.service'
import errors from '@/constants/err.type'
const { delUserErr, delSuperUserErr } = errors
import { excelBaseStyle, userExcelHeader, userTemExcelHeader } from '@/public/excelMap'
import Dept from '@/model/system/dept.model'
import { excelJsExport } from '@/utils/excel'

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
    const list = ctx.state.formatData
    const dicts = ctx.state.dicts

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '用户数据',
      style: excelBaseStyle,
      headerColumns: userExcelHeader,
      tableData: list,
      dicts: dicts
    })
    // 3、返回结果
    ctx.body = buffer
  }

  // 导出用户excel模板
  async exportTemlateCon(ctx: Context, next: () => Promise<void>) {
    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '用户数据',
      style: excelBaseStyle,
      headerColumns: userTemExcelHeader,
      tableData: []
    })

    // 3、返回结果
    ctx.body = buffer
  }

  // 导入 用户excel
  async importExcelCon(ctx: Context, next: () => Promise<void>) {
    const excelData = ctx.state.excelData
    // 将导入用户的部门名称替换成部门id
    for (let i = 0; i < excelData.length; i++) {
      for (let key in excelData[i]) {
        if (key === 'dept.dept_name') {
          const deptArr = (await Dept.findAll({
            raw: true,
            attributes: ['dept_id'],
            where: {
              dept_name: excelData[i][key]
            }
          })) as unknown as { dept_id: number }[]
          excelData[i]['dept_id'] = deptArr[0].dept_id
        }
      }
    }

    ctx.state.excelData = excelData
    await next()
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
  exportTemlateCon,
  importExcelCon
} = new UserController()
