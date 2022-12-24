import User from '../../model/user.model'
import Dept from '../../model/system/dept.model'

class UserService {
  // 获取用户列表
  async getUserListSer(pageNum: string = '1', pageSize: string = '10') {
    const res = User.findAll({
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize)
    })
    return res || null
  }

  // 获取用户的部门信息
  async getUserDeptSer(dept_id) {
    const res = Dept.findAll({
      where: {
        dept_id
      }
    })

    return res || null
  }
}

export const { getUserListSer, getUserDeptSer } = new UserService()
