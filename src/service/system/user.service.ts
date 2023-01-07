import Dept from '../../model/system/dept.model'
import User from '../../model/user.model'

class UserService {
  // 获取用户列表
  async getUserListSer(pageNum: string = '1', pageSize: string = '10') {
    const res = User.findAndCountAll({
      include: [
        {
          model: Dept,
          as: 'dept'
        }
      ],
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize)
    })
    // 将用户密码移除
    ;(await res).rows.forEach((element: any) => {
      for (const key in element.dataValues) {
        if (key === 'password') element.dataValues[key] = null
      }
    })
    const count = await User.count()
    const list = {
      count,
      rows: (await res).rows || {}
    }
    return list
  }

  // 删除用户
  async delUserSer(userId) {
    const res = User.destroy({
      where: { user_id: userId }
    })

    return res || null
  }

  // 查询部门下拉树结构
  async getdeptTreeSer() {
    const res = Dept.findAll()

    return res || null
  }
}

export const { getUserListSer, delUserSer, getdeptTreeSer } = new UserService()
