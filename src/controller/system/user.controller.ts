import { Context } from 'koa'
import { getUserListSer, getUserDeptSer } from '../../service/system/user.service'
import { userType, deptType } from '../../types'

class UserController {
  // 获取路由
  async getUserListCon(ctx: Context, next: () => Promise<void>) {
    const { pageNum, pageSize } = ctx.query as {
      pageNum: string
      pageSize: string
    }
    const res = (await getUserListSer(pageNum, pageSize)) as userType[]

    // 遍历 用户 列表，将用户部门信息查找并添加道用户表内

    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '查询用户成功！',
      result: res
    }
  }
}

export const { getUserListCon } = new UserController()
