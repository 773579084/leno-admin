import Dept from '@/model/system/dept.model'
import User from '@/model/user.model'
import Post from '@/model/system/post.model'
import Role from '@/model/system/role.model'
import UserRole from '@/model/system/sys_user_role.model'
import UserPost from '@/model/system/sys_user_post.model'

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

  // 获取岗位信息
  async getPostSer() {
    const res = Post.findAll()

    return res || null
  }

  // 获取角色信息
  async getRoleSer() {
    const res = Role.findAll()
    return res || null
  }

  // 新增 用户与角色关系
  async addUserRole(list) {
    UserRole.bulkCreate(list, { validate: true })
  }
  // 新增 用户与岗位关系
  async addUserPost(list) {
    UserPost.bulkCreate(list, { validate: true })
  }
}

export const {
  getUserListSer,
  delUserSer,
  getdeptTreeSer,
  getPostSer,
  getRoleSer,
  addUserRole,
  addUserPost
} = new UserService()
