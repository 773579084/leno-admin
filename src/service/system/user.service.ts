import Dept from '@/model/system/dept.model'
import User from '@/model/user.model'
import Post from '@/model/system/post.model'
import Role from '@/model/system/role.model'
import UserRole from '@/model/system/sys_user_role.model'
import UserPost from '@/model/system/sys_user_post.model'
import { userType } from '@/types'

class UserService {
  // 获取用户列表
  async getUserListSer(pageNum: string = '1', pageSize: string = '10') {
    const res = User.findAndCountAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Dept,
          as: 'dept'
        }
      ],
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize)
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
    const res = Post.findAll({})
    return res || null
  }

  // 获取角色信息
  async getRoleSer() {
    const res = Role.findAll()
    return res || null
  }

  // 新增用户
  async addUserSer(user) {
    const res = (await User.create(user)) as any
    return res || {}
  }

  // 新增 用户与角色关系
  async addUserRoleSer(list) {
    UserRole.bulkCreate(list)
  }

  // 新增 用户与岗位关系
  async addUserPostSer(list) {
    UserPost.bulkCreate(list)
  }

  // 查询用户岗位关联表
  async getUserPostSer(userId) {
    const res = UserPost.findAll({
      attributes: ['post_id'],
      where: {
        user_id: userId
      }
    })
    return res || []
  }

  // 根据ids查询岗位信息
  async checkPostSer(list: number[]) {
    const res = Post.findAll({
      where: {
        post_id: [...list]
      }
    })
    return res || null
  }

  // 查询角色岗位关联表
  async getUserRoleSer(userId) {
    const res = UserRole.findAll({
      attributes: ['role_id'],
      where: {
        user_id: userId
      }
    })
    return res || []
  }

  // 根据ids查询角色信息
  async checkRoleSer(list: number[]) {
    const res = Role.findAll({
      where: {
        role_id: [...list]
      }
    })
    return res || null
  }
}

export const {
  getUserListSer,
  delUserSer,
  getdeptTreeSer,
  getPostSer,
  getRoleSer,
  addUserRoleSer,
  addUserPostSer,
  addUserSer,
  getUserPostSer,
  checkPostSer,
  getUserRoleSer,
  checkRoleSer
} = new UserService()
