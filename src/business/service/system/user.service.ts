import Dept from '@/mysql/model/system/dept.model'
import User from '@/mysql/model/user.model'
import Post from '@/mysql/model/system/post.model'
import Role from '@/mysql/model/system/role.model'
import UserRole from '@/mysql/model/system/sys_user_role.model'
import UserPost from '@/mysql/model/system/sys_user_post.model'
import { userQuerySerType } from '@/types'
import { Op } from 'sequelize'

// 获取用户列表
export const getUserListSer = async (queryParams: userQuerySerType) => {
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
    count: res.count,
    rows: res.rows || {}
  }
  return list
}

// 删除用户
export const delUserSer = async (userId) => {
  const res = await User.update(
    {
      del_flag: '2'
    },
    { where: { user_id: userId } }
  )

  return res || null
}

// 查询部门下拉树结构
export const getdeptTreeSer = async () => {
  const res = await Dept.findAll({})

  return res || null
}

// 获取岗位信息
export const getPostSer = async () => {
  const res = await Post.findAll({})
  return res || null
}

// 获取角色信息
export const getRoleSer = async () => {
  const res = await Role.findAll()
  return res || null
}

// 新增用户
export const addUserSer = async (user) => {
  const res = (await User.create(user)) as any
  return res || {}
}

// 新增 用户与角色关系
export const addUserRoleSer = async (list) => {
  await UserRole.bulkCreate(list)
}

// 新增 用户与岗位关系
export const addUserPostSer = async (list) => {
  await UserPost.bulkCreate(list)
}

// 查询用户岗位关联表
export const getUserPostSer = async (userId) => {
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
export const getUserRoleSer = async (userId) => {
  const res = await UserRole.findAll({
    raw: true,
    attributes: ['role_id'],
    where: {
      user_id: userId
    }
  })
  return res || []
}

export const putUserSer = async (user) => {
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

export const delUserPost = async (userId) => {
  const res = await UserPost.destroy({
    where: { user_id: userId }
  })
  return res || null
}

export const delUserRole = async (userId) => {
  const res = await UserRole.destroy({
    where: { user_id: userId }
  })
  return res || null
}

export const putUserStatusSer = async (user) => {
  const { userId, ...data } = user
  const res = await User.update(data, { where: { user_id: userId } })

  return res[0] > 0
}

// 导出用户列表
export const exportUserListSer = async () => {
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
  return res.rows || {}
}
