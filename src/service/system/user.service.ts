import Dept from '@/model/system/dept.model'
import User from '@/model/user.model'
import Post from '@/model/system/post.model'
import Role from '@/model/system/role.model'
import UserRole from '@/model/system/sys_user_role.model'
import UserPost from '@/model/system/sys_user_post.model'
import { userQuerySerType } from '@/types'
import { Op } from 'sequelize'

class UserService {
  // 获取用户列表
  async getUserListSer(queryParams: userQuerySerType) {
    const { pageNum, pageSize, beginTime, endTime, ...params } = queryParams
    if (beginTime)
      params.created_at = {
        [Op.between]: [beginTime, endTime]
      }

    const res = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Dept,
          as: 'dept'
        }
      ],
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize),
      where: {
        del_flag: '0',
        ...params
      }
    })

    const list = {
      count: (await res).count,
      rows: (await res).rows || {}
    }
    return list
  }

  // 删除用户
  async delUserSer(userId) {
    const res = await User.update(
      {
        del_flag: '2'
      },
      { where: { user_id: userId } }
    )

    return res || null
  }

  // 查询部门下拉树结构
  async getdeptTreeSer() {
    const res = await Dept.findAll({})

    return res || null
  }

  // 获取岗位信息
  async getPostSer() {
    const res = await Post.findAll({})
    return res || null
  }

  // 获取角色信息
  async getRoleSer() {
    const res = await Role.findAll()
    return res || null
  }

  // 新增用户
  async addUserSer(user) {
    const res = (await User.create(user)) as any
    return res || {}
  }

  // 新增 用户与角色关系
  async addUserRoleSer(list) {
    await UserRole.bulkCreate(list)
  }

  // 新增 用户与岗位关系
  async addUserPostSer(list) {
    await UserPost.bulkCreate(list)
  }

  // 查询用户岗位关联表
  async getUserPostSer(userId) {
    const res = await UserPost.findAll({
      raw: true,
      attributes: ['post_id'],
      where: {
        user_id: userId
      }
    })
    return res || []
  }

  // 查询角色岗位关联表
  async getUserRoleSer(userId) {
    const res = await UserRole.findAll({
      raw: true,
      attributes: ['role_id'],
      where: {
        user_id: userId
      }
    })
    return res || []
  }

  async putUserSer(user) {
    const { nickName, deptId, ...data } = user
    const res = await User.update(
      {
        nick_name: nickName,
        dept_id: deptId,
        ...data
      },
      { where: { user_id: user.userId } }
    )

    return res[0] > 0
  }

  async delUserPost(userId) {
    const res = await UserPost.destroy({
      where: { user_id: userId }
    })
    return res || null
  }

  async delUserRole(userId) {
    const res = await UserRole.destroy({
      where: { user_id: userId }
    })
    return res || null
  }

  async putUserStatusSer(user) {
    const { userId, ...data } = user
    const res = await User.update(data, { where: { user_id: userId } })

    return res[0] > 0
  }

  // 导出用户列表
  async exportUserListSer() {
    const res = await User.findAndCountAll({
      raw: true, // 设置为 true，即可返回源数据
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Dept,
          as: 'dept',
          attributes: ['dept_name', 'leader']
        }
      ]
    })
    console.log(159, res)

    return (await res).rows || {}
  }
}

export const {
  putUserStatusSer,
  getUserListSer,
  delUserSer,
  getdeptTreeSer,
  getPostSer,
  getRoleSer,
  addUserRoleSer,
  addUserPostSer,
  addUserSer,
  getUserPostSer,
  getUserRoleSer,
  putUserSer,
  delUserPost,
  delUserRole,
  exportUserListSer
} = new UserService()
