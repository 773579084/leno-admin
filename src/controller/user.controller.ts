import { Context } from 'koa'
import {
  createdUser,
  getUserInfo,
  updatePassword,
  updateUserInfoSer,
  updateAvatarSer,
  deletFrontAvatarSer,
  getAllUserInfoSer
} from '@/service/user.service'
import { pwdType, userType, imgType } from '@/types'
import jwt from 'jsonwebtoken'
import env from '@/config/config.default'
import bcrypt from 'bcryptjs'
import errors from '@/constants/err.type'
import path from 'path'
import { removeSpecifyFile, formatHumpLineTransfer } from '@/utils'
import dayjs from 'dayjs'

const { enteredPasswordsDiffer, userDoesNotExist, reviseErr, updateAvatarErr, getUserInfoErr } =
  errors

class UserController {
  // 注册
  async register(ctx: Context, next: () => Promise<void>) {
    // 1、获取数据
    const { userName, password } = ctx.request.body as userType

    // 2、操作数据库
    const res = await createdUser(userName as string, password as string)

    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '用户注册成功',
      result: {
        userId: res.user_id,
        userName: res.user_name
      }
    }
  }

  // 登录
  async login(ctx: Context, next: () => Promise<void>) {
    const { userName } = ctx.request.body as userType

    // 1、获取用户信息（token 中包含 userId，userName） expiresIn : token有效时间
    try {
      const { password, ...res } = await getUserInfo({ userName })
      const data = formatHumpLineTransfer(res)

      ctx.body = {
        code: 200,
        message: '用户登录成功！',
        result: {
          token: jwt.sign(
            {
              ...data,
              exp: dayjs().add(10, 'd').valueOf()
            },
            env.JWT_SECRET
          ),
          refreshToken: jwt.sign(
            {
              ...data,
              exp: dayjs().add(30, 'd').valueOf()
            },
            env.JWT_REFRESH_SECRET
          )
        }
      }
    } catch (error) {
      console.error('用户登录失败', error)
    }
  }

  // 获取用户
  async getUserInfoCon(ctx: Context, next: () => Promise<void>) {
    const { userId } = ctx.state.user as userType

    try {
      const { password, ...res } = await getAllUserInfoSer({ userId })
      const data = formatHumpLineTransfer(res)
      ctx.body = {
        code: 200,
        message: '用户获取个人信息成功！',
        result: data
      }
    } catch (error) {
      console.error('用户获取个人信息失败', error)
      return ctx.app.emit('error', getUserInfoErr, ctx)
    }
  }

  // 重置密码
  async updatePwd(ctx: Context, next: () => Promise<void>) {
    const { oldPwd, newPwd } = ctx.request.body as pwdType
    const { userId } = ctx.state.user as userType

    const res = await getUserInfo({ userId })
    // 判断 旧密码 是否与数据库内的密码一致
    if (!bcrypt.compareSync(oldPwd as string, res.password)) {
      console.error('新旧密码不一致')
      return ctx.app.emit('error', enteredPasswordsDiffer, ctx)
    }
    // 将 新密码加密 更新到数据库内
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(newPwd as string, salt)

    if (await updatePassword({ newPwd: hash, userId })) {
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
    // 获得 userId 将更新的数据插入到数据库
    const { email, nickName, phonenumber, sex } = ctx.request.body as userType
    const { userId } = ctx.state.user as userType

    const res = await getUserInfo({ userId })

    if (res) {
      if (await updateUserInfoSer({ userId, email, nickName, phonenumber, sex })) {
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
    const { userId } = ctx.state.user as userType

    if (avatar) {
      // 删除上一次存储的图片
      const { avatar } = await deletFrontAvatarSer({ userId })
      if (avatar) {
        await removeSpecifyFile(avatar)
      }

      // 把用户头像名称保存到数据库
      if (await updateAvatarSer({ userId, basePath })) {
        ctx.body = {
          code: 200,
          message: '头像上传成功',
          result: {
            avatarImg: basePath
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

  // 重新返回新的 token 和 refreshToken
  async refreshTokenCon(ctx: Context, next: () => Promise<void>) {
    const res = ctx.state.user
    const data = formatHumpLineTransfer(res)
    ctx.body = {
      code: 200,
      message: 'token状态刷新成功！',
      result: {
        token: jwt.sign(
          {
            ...data,
            exp: dayjs().add(10, 'd').valueOf()
          },
          env.JWT_SECRET
        )
      }
    }
  }
}

export const {
  login,
  register,
  updatePwd,
  updateUserInfo,
  updateAvatarCon,
  getUserInfoCon,
  refreshTokenCon
} = new UserController()
