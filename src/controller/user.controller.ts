import { Context } from 'koa'
import {
  createdUser,
  getUserInfo,
  updatePassword,
  updateUserInfoSer,
  updateAvatarSer,
  deletFrontAvatarSer,
  getAllUserInfoSer
} from '../service/user.service'
import { pwdType, userType, imgType } from '../types'
import jwt from 'jsonwebtoken'
import env from '../config/config.default'
import bcrypt from 'bcryptjs'
import errors from '../constants/err.type'
import path from 'path'
import { removeSpecifyFile } from '../utils'

const { enteredPasswordsDiffer, userDoesNotExist, reviseErr, updateAvatarErr, getUserInfoErr } =
  errors

class UserController {
  // 注册
  async register(ctx: Context, next: () => Promise<void>) {
    // 1、获取数据
    const { user_name, password } = ctx.request.body as userType

    // 2、操作数据库
    const res = await createdUser(user_name as string, password as string)

    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name
      }
    }
  }

  // 登录
  async login(ctx: Context, next: () => Promise<void>) {
    const { user_name } = ctx.request.body as userType

    // 1、获取用户信息（token 中包含 id，user_name） expiresIn : token有效时间
    try {
      const { password, ...res } = await getUserInfo({ user_name })

      ctx.body = {
        code: 200,
        message: '用户登录成功！',
        result: {
          token: jwt.sign(res, env.JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (error) {
      console.error('用户登录失败', error)
    }
  }

  // 获取用户
  async getUserInfoCon(ctx: Context, next: () => Promise<void>) {
    const { id } = ctx.state.user as userType

    try {
      const { password, ...res } = await getAllUserInfoSer({ id })
      ctx.body = {
        code: 200,
        message: '用户获取个人信息成功！',
        result: res
      }
    } catch (error) {
      console.error('用户获取个人信息失败', error)
      return ctx.app.emit('error', getUserInfoErr, ctx)
    }
  }

  // 重置密码
  async updatePwd(ctx: Context, next: () => Promise<void>) {
    const { oldPwd, newPwd } = ctx.request.body as pwdType
    const { id } = ctx.state.user as userType

    const res = await getUserInfo({ id })
    // 判断 旧密码 是否与数据库内的密码一致
    if (!bcrypt.compareSync(oldPwd as string, res.password)) {
      console.error('新旧密码不一致')
      return ctx.app.emit('error', enteredPasswordsDiffer, ctx)
    }
    // 将 新密码加密 更新到数据库内
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(newPwd as string, salt)

    if (await updatePassword({ newPwd: hash, id })) {
      ctx.body = {
        code: 200,
        message: '密码修改成功！'
      }
    } else {
      console.error('密码修改失败')
      return ctx.app.emit('error', reviseErr, ctx)
    }
  }

  // 修改个人基本信息
  async updateUserInfo(ctx: Context, next: () => Promise<void>) {
    // 获得 id 将更新的数据插入到数据库
    const { email, nick_name, phonenumber, sex } = ctx.request.body as userType
    const { id } = ctx.state.user as userType

    const res = await getUserInfo({ id })
    if (res) {
      if (await updateUserInfoSer({ id, email, nick_name, phonenumber, sex })) {
        ctx.body = {
          code: 200,
          message: '个人信息修改成功！'
        }
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
  async updateAvatarCon(ctx: Context, next: () => Promise<void>) {
    const { avatar } = ctx.request?.files // files 是koa-body提供的文件地址位置
    const { filepath } = avatar as imgType
    const basePath = path.basename(filepath) as string
    const { id } = ctx.state.user as userType

    if (avatar) {
      // 删除上一次的图片
      const { avatar } = await deletFrontAvatarSer({ id })
      if (avatar) {
        await removeSpecifyFile(avatar)
      }
      console.log(141)

      // 把用户头像名称保存到数据库
      if (await updateAvatarSer({ id, basePath })) {
        ctx.body = {
          code: 200,
          message: '头像上传成功',
          result: {
            avatar_img: basePath
          }
        }
      } else {
        console.error('数据库用户头像地址更新失败')
        return ctx.app.emit('error', updateAvatarErr, ctx)
      }
    } else {
      console.error('用户头像上传失败')
      return ctx.app.emit('error', updateAvatarErr, ctx)
    }
  }
}

export const { login, register, updatePwd, updateUserInfo, updateAvatarCon, getUserInfoCon } =
  new UserController()
