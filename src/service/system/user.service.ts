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

    return (await res).rows || null
  }
}

export const { getUserListSer } = new UserService()
