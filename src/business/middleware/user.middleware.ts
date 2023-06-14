import { Context } from 'koa'
import path from 'path'
import { userType, pwdType, imgType, IuserInfoType } from '@/types'
import {
  createdUser,
  deletFrontAvatarSer,
  getAllUserInfoSer,
  getUserInfo,
  updateAvatarSer,
  updatePassword,
  updateUserInfoSer,
  userStatusSer
} from '@/business/service/user.service'
import errors from '@/app/err.type'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createHash, formatHumpLineTransfer, removeSpecifyFile } from '@/business/utils'
import dayjs from 'dayjs'
import { getUserRoleSer } from '../service/system/user.service'
import { queryConditionsData } from '../service'
import SysRole from '@/mysql/model/system/role.model'
import { Op } from 'sequelize'
import SysRoleMenu from '@/mysql/model/system/sys_role_menu.model'
import SysMenu from '@/mysql/model/system/menu.model'
import { addSession, queryKeyValue, removeKey, removeListKey } from '../utils/auth'
import SysUserPost from '@/mysql/model/system/sys_user_post.model'
import SysPost from '@/mysql/model/system/post.model'
import { queryUserMachine } from '../utils/log'
import { saveMenuMes } from '../utils/redis'

const {
  userExisting,
  userLoginError,
  userDoesNotExist,
  userRegisterError,
  InvalidConnectionError,
  userStatusErr,
  sqlErr,
  getUserInfoErr,
  enteredPasswordsDiffer,
  reviseErr,
  updateAvatarErr
} = errors

// 判断用户是否停用
export const isUserStatusMid = async (ctx: Context, next: () => Promise<void>) => {
  const { userName } = ctx.request['body'] as userType

  try {
    const res = (await userStatusSer(userName)) as unknown as { status: string }
    if (res.status === '1') {
      console.error('该用户为停用状态!', ctx.request['body'])
      return ctx.app.emit('error', userStatusErr, ctx)
    }
  } catch (error) {
    console.error('用户是否停用数据库错误', ctx.request['body'])
    return ctx.app.emit('error', sqlErr, ctx)
  }
  await next()
}

// 判断用户名是否重复
export const verifyUserMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.request['body'] as userType
    if (await getUserInfo({ userName })) {
      console.error('用户名已存在!', ctx.request['body'])
      ctx.app.emit('error', userExisting, ctx)
      return
    }
  } catch (error) {
    console.error('获取用户信息错误', error)
    ctx.app.emit('error', userRegisterError, ctx)
  }

  await next()
}

// 用户密码加密中间件
export const crptyPasswordMid = async (ctx: Context, next: () => Promise<void>) => {
  const { password } = ctx.request['body'] as userType

  const salt = bcrypt.genSaltSync(10)

  const hash = bcrypt.hashSync(password as string, salt)

  ctx.request['body'].password = hash

  await next()
}

// 判断用户是否存在，密码是否匹配
export const loginValidatorMid = async (ctx: Context, next: () => Promise<void>) => {
  const { userName, password } = ctx.request['body'] as userType

  try {
    // 检查是否有重复的用户名，如果有返回 查询到的数据
    const res = await getUserInfo({ userName })

    if (!res) {
      console.error('用户名不存在', { userName })
      ctx.app.emit('error', userDoesNotExist, ctx)
      return
    }

    // 判断密码是否匹配
    if (!bcrypt.compareSync(password as string, res.password)) {
      console.error('密码错误')
      ctx.app.emit('error', InvalidConnectionError, ctx)
      return
    }
    await next()
  } catch (error) {
    console.error(error)
    return ctx.app.emit('error', userLoginError, ctx)
  }
}

// 获取用户基本信息
export const getUserBaseMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.request['body'] as userType
    const { password, ...res } = await getUserInfo({ userName })
    const data = formatHumpLineTransfer(res)

    ctx.state.user = data
    await next()
  } catch (error) {
    console.error('获取用户基本信息失败', error)
    return ctx.app.emit('error', userLoginError, ctx)
  }
}

// 注册
export const registerMid = async (ctx: Context, next: () => Promise<void>) => {
  // 1、获取数据
  const { userName, password } = ctx.request['body'] as userType
  try {
    // 2、操作数据库
    const res = await createdUser(userName as string, password as string)

    ctx.state.formatData = {
      userId: res.user_id,
      userName: res.user_name
    }

    await next()
  } catch (error) {
    console.error('用户注册失败', error)
    return ctx.app.emit('error', getUserInfoErr, ctx)
  }
}

// 登录
export const loginMid = async (ctx: Context, next: () => Promise<void>) => {
  const data = ctx.state.formatData as IuserInfoType

  // 获取用户信息（token 中包含 userId，userName） expiresIn : token有效时间
  try {
    // 1 生成随机的hash sessionId
    const hash = createHash()

    // 2 生成token
    ctx.state.formatData = {
      token: jwt.sign(
        {
          userId: data.userInfo.userId,
          userName: data.userInfo.userName,
          session: hash,
          exp: dayjs().add(100, 'y').valueOf()
        },
        process.env.JWT_SECRET
      )
    }
    // 2-2 获取请求用户的设备信息
    const machine = await queryUserMachine(ctx)

    // 3 将登录基本信息存储到 redis的login_token，并且设置过期时间
    addSession(hash, { ...machine, loginTime: new Date(), ...data })
    await next()

    // 存储所有表信息（供全局调用）
    saveMenuMes()
  } catch (error) {
    console.error('用户登录失败', error)
    return ctx.app.emit('error', getUserInfoErr, ctx)
  }
}

// 获取用户基本信息
export const getUserInfoMid = async (ctx: Context, next: () => Promise<void>) => {
  const { userId } = ctx.state.user as userType

  try {
    const { password, ...res } = await getAllUserInfoSer({ userId })
    // 查询用户关联角色id
    const roleIds = (await getUserRoleSer(userId)) as unknown as { role_id: number }[]
    const ids = roleIds.map((item) => item.role_id)

    const roleMessage = await queryConditionsData(SysRole, {
      role_id: {
        [Op.in]: ids
      }
    })
    res.roles = roleMessage
    const data = formatHumpLineTransfer(res)
    ctx.state.formatData = data
    await next()
  } catch (error) {
    console.error('用户获取个人信息失败', error)
    return ctx.app.emit('error', getUserInfoErr, ctx)
  }
}

// 获取个人信息的其他信息
export const getProfile = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userInfo } = ctx.state.formatData as IuserInfoType
    const postGroup = []
    const roleGroup = []
    userInfo.roles.forEach((item) => {
      roleGroup.push(item.roleName)
    })

    // 用户关联岗位查询
    const postMessage = await queryConditionsData(SysUserPost, {
      user_id: userInfo.userId
    })

    const postIds = postMessage.map((item) => item.post_id)

    const postData = await queryConditionsData(SysPost, {
      post_id: {
        [Op.in]: postIds
      }
    })
    postData.forEach((item) => {
      postGroup.push(item.post_name)
    })

    ctx.state.formatData = {
      ...userInfo,
      postGroup: postGroup.join(','),
      roleGroup: roleGroup.join(',')
    }
    await next()
  } catch (error) {
    console.error('用户获取个人信息失败', error)
    return ctx.app.emit('error', getUserInfoErr, ctx)
  }
}

// 获取权限
export const getPermRoleMid = async (ctx: Context, next: () => Promise<void>) => {
  const userInfo = ctx.state.formatData as userType
  const roles = []
  const permissionsIds = []
  const permissions = []
  userInfo.roles.forEach((item) => {
    if (item.roleKey === 'admin') {
      permissions.push('*:*:*')
      roles.push('admin')
    } else {
      roles.push(item.roleKey)
      permissionsIds.push(item.roleId)
    }
  })

  // 返回权限 如果 permissions 有值，则表示为超级管理员，否则
  if (permissions.length < 1) {
    // 查询角色关联的菜单ids
    const menuRole = (await queryConditionsData(
      SysRoleMenu,
      {
        role_id: {
          [Op.in]: permissionsIds
        }
      },
      { attributes: ['menu_id'] }
    )) as { menu_id: number }[]
    const menuIds = menuRole.map((item) => item.menu_id)

    // 查寻找角色相关的菜单
    const menus = (await queryConditionsData(SysMenu, {
      menu_id: {
        [Op.in]: Array.from(new Set(menuIds))
      }
    })) as { perms: string }[]

    menus.forEach((menu) => {
      if (menu.perms) permissions.push(menu.perms)
    })
  }

  ctx.state.formatData = {
    userInfo,
    roles,
    permissions
  }
  await next()
}

// 重置密码
export const updatePwdMid = async (ctx: Context, next: () => Promise<void>) => {
  const { oldPwd, newPwd } = ctx.request['body'] as pwdType
  const { userId, userName } = ctx.state.user as userType

  const res = await getUserInfo({ userId })
  // 判断 旧密码 是否与数据库内的密码一致
  if (!bcrypt.compareSync(oldPwd as string, res.password)) {
    console.error('新旧密码不一致')
    return ctx.app.emit('error', enteredPasswordsDiffer, ctx)
  }
  // 将 新密码加密 更新到数据库内
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(newPwd as string, salt)

  if (await updatePassword({ newPwd: hash, userId, update_by: userName })) {
    await next()
  } else {
    console.error('密码修改失败')
    return ctx.app.emit('error', reviseErr, ctx)
  }
}

// 修改个人基本信息
export const updateUserInfoMid = async (ctx: Context, next: () => Promise<void>) => {
  // 获得 userId 将更新的数据插入到数据库
  const { email, nickName, phonenumber, sex } = ctx.request['body'] as userType
  const { userId, userName } = ctx.state.user as userType

  const res = await getUserInfo({ userId })

  if (res) {
    if (
      await updateUserInfoSer({ userId, email, nickName, phonenumber, sex, update_by: userName })
    ) {
      await next()
    } else {
      console.error('个人信息修改失败')
      return ctx.app.emit('error', reviseErr, ctx)
    }
  } else {
    console.error('个人用户信息更新未查到该用户')
    return ctx.app.emit('error', userDoesNotExist, ctx)
  }
}

// 上传头像
export const uploadAvatarMid = async (ctx: Context, next: () => Promise<void>) => {
  const { avatar } = (ctx.request as any).files
  const { filepath } = avatar as imgType
  const basePath = path.basename(filepath) as string
  const { userId, userName } = ctx.state.user as userType

  if (avatar) {
    // 删除上一次存储的图片
    const { avatar } = await deletFrontAvatarSer({ userId })
    if (avatar) {
      removeSpecifyFile(avatar)
    }

    // 把用户头像名称保存到数据库
    if (await updateAvatarSer({ userId, basePath, update_by: userName })) {
      ctx.state.formatData = {
        avatarImg: basePath
      }
      await next()
    } else {
      console.error('数据库用户头像地址更新失败')
      return ctx.app.emit('error', updateAvatarErr, ctx)
    }
  } else {
    console.error('用户头像上传失败')
    return ctx.app.emit('error', updateAvatarErr, ctx)
  }
}

// 初始化查询个人信息（权限、角色）
export const queryUserInfoMid = async (ctx: Context, next: () => Promise<void>) => {
  const { session } = ctx.state.user
  const userData = await queryKeyValue(session)

  ctx.state.formatData = {
    userInfo: userData.userInfo,
    roles: userData.roles,
    permissions: userData.permissions
  }
  await next()
}

// 重新返回新的 token 和 refreshToken
export const userLogoutMid = async (ctx: Context, next: () => Promise<void>) => {
  const { session } = ctx.state.user

  removeListKey([session])
  removeKey([session])
  await next()
}
