import { Context } from 'koa'
import path from 'path'
import { userType, pwdType, imgType } from '@/types'
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
import { formatHumpLineTransfer, removeSpecifyFile } from '@/business/utils'
import dayjs from 'dayjs'
import { getUserRoleSer } from '../service/system/user.service'
import { queryConditionsData } from '../service'
import SysRole from '@/mysql/model/system/role.model'
import { Op } from 'sequelize'
import SysRoleMenu from '@/mysql/model/system/sys_role_menu.model'
import SysMenu from '@/mysql/model/system/menu.model'
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
  } catch (error) {
    console.error(error)
    return ctx.app.emit('error', userLoginError, ctx)
  }

  await next()
}

// 注册
export const registerMid = async (ctx: Context, next: () => Promise<void>) => {
  // 1、获取数据
  const { userName, password } = ctx.request['body'] as userType

  // 2、操作数据库
  const res = await createdUser(userName as string, password as string)

  ctx.state.formatData = {
    userId: res.user_id,
    userName: res.user_name
  }

  await next()
}

// 登录
export const loginMid = async (ctx: Context, next: () => Promise<void>) => {
  const { userName } = ctx.request['body'] as userType

  // 1、获取用户信息（token 中包含 userId，userName） expiresIn : token有效时间
  try {
    const { password, ...res } = await getUserInfo({ userName })
    const data = formatHumpLineTransfer(res)

    ctx.state.formatData = {
      token: jwt.sign(
        {
          ...data,
          exp: dayjs().add(10, 'd').valueOf()
        },
        process.env.JWT_SECRET
      ),
      refreshToken: jwt.sign(
        {
          ...data,
          exp: dayjs().add(30, 'd').valueOf()
        },
        process.env.JWT_REFRESH_SECRET
      )
    }
  } catch (error) {
    console.error('用户登录失败', error)
  }

  await next()
}

//  获取用户
export const getUserInfoMid = async (ctx: Context, next: () => Promise<void>) => {
  const { userId } = ctx.state.user as userType
  console.log(161, userId)

  try {
    const { password, ...res } = await getAllUserInfoSer({ userId })
    // 查询用户关联角色id
    const roleIds = (await getUserRoleSer(userId)) as unknown as { role_id: number }[]
    const ids = []
    roleIds.forEach((item) => {
      ids.push(item.role_id)
    })

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

    // 查寻找角色相关的
    const menus = (await queryConditionsData(
      SysMenu,
      {
        menu_id: {
          [Op.in]: Array.from(new Set(menuIds))
        }
      },
      { attributes: ['perms'] }
    )) as { perms: string }[]

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

// 重新返回新的 token 和 refreshToken
export const refreshTokenMid = async (ctx: Context, next: () => Promise<void>) => {
  const res = ctx.state.user
  const data = formatHumpLineTransfer(res)

  ctx.state.formatData = {
    token: jwt.sign(
      {
        ...data,
        exp: dayjs().add(10, 'd').valueOf()
      },
      process.env.JWT_SECRET
    )
  }

  await next()
}
