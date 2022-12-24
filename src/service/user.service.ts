import User from '../model/user.model'
import { userType } from '../types'

class UserService {
  // 注册
  async createdUser(user_name: string, password: string) {
    // 插入数据到数据库
    const res = (await User.create({ user_name, password })) as any

    return res.dataValues
  }

  // 查找数据是否有重复的数据
  async getUserInfo({ user_id, user_name, password }: userType) {
    const whereOpt = {}

    // 判断传了那个数，就将那个数传入到 whereOpt中
    user_id && Object.assign(whereOpt, { user_id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })

    // 查找是否重复
    const res = (await User.findOne({
      attributes: ['user_id', 'user_name', 'password'],
      where: whereOpt
    })) as any

    return res ? res.dataValues : null
  }

  // 获取 所有个人信息
  async getAllUserInfoSer({ user_id }) {
    const res = (await User.findOne({
      where: user_id
    })) as any

    return res ? res.dataValues : null
  }

  // 更新密码数据
  async updatePassword({ newPwd, user_id }: { newPwd: string; user_id: number }) {
    const res = await User.update(
      { password: newPwd },
      {
        where: { user_id }
      }
    )

    return res[0] > 0
  }

  // 更新个人信息
  async updateUserInfoSer({ user_id, email, nick_name, phonenumber, sex }) {
    const res = await User.update(
      { email, nick_name, phonenumber, sex },
      {
        where: { user_id }
      }
    )

    return res[0] > 0
  }

  // 查找用户之前有无上传头像，有上传将之前上传的删除掉
  async deletFrontAvatarSer({ user_id }) {
    const res = (await User.findOne({
      attributes: ['avatar'],
      where: user_id
    })) as any

    return res ? res.dataValues : ''
  }

  // 上传个人头像地址
  async updateAvatarSer({ user_id, basePath }) {
    const res = await User.update(
      { avatar: basePath },
      {
        where: { user_id }
      }
    )

    return res
  }
}

export const {
  createdUser,
  getUserInfo,
  updatePassword,
  updateUserInfoSer,
  updateAvatarSer,
  deletFrontAvatarSer,
  getAllUserInfoSer
} = new UserService()
