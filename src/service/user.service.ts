import User from '@/model/user.model'
import { userType } from '@/types'

class UserService {
  // 注册
  async createdUser(userName: string, password: string) {
    // 插入数据到数据库
    const res = (await User.create({ user_name: userName, password })) as any

    return res.dataValues
  }

  // 查找数据是否有重复的数据
  async getUserInfo({ userId, userName, password }: userType) {
    const whereOpt = {}

    // 判断传了那个数，就将那个数传入到 whereOpt中
    userId && Object.assign(whereOpt, { user_id: userId })
    userName && Object.assign(whereOpt, { user_name: userName })
    password && Object.assign(whereOpt, { password })

    // 查找是否重复
    const res = (await User.findOne({
      attributes: ['user_id', 'user_name', 'password'],
      where: whereOpt
    })) as any

    return res ? res.dataValues : null
  }

  // 获取 个人信息
  async getAllUserInfoSer({ userId }) {
    const res = (await User.findOne({
      where: { user_id: userId }
    })) as any
    return res ? res.dataValues : null
  }

  // 更新密码数据
  async updatePassword({
    newPwd,
    userId,
    update_by
  }: {
    newPwd: string
    userId: number
    update_by: string
  }) {
    const res = await User.update(
      { password: newPwd, update_by },
      {
        where: { user_id: userId }
      }
    )

    return res[0] > 0
  }

  // 更新个人信息
  async updateUserInfoSer({ userId, email, nickName, phonenumber, sex, update_by }) {
    const res = await User.update(
      { email, nick_name: nickName, phonenumber, sex, update_by },
      {
        where: { user_id: userId }
      }
    )

    return res[0] > 0
  }

  // 查找用户之前有无上传头像，有上传将之前上传的删除掉
  async deletFrontAvatarSer({ userId }) {
    const res = (await User.findOne({
      attributes: ['avatar'],
      where: { user_id: userId }
    })) as any

    return res ? res.dataValues : ''
  }

  // 上传个人头像地址
  async updateAvatarSer({ userId, basePath, update_by }) {
    const res = await User.update(
      { avatar: basePath, update_by },
      {
        where: { user_id: userId }
      }
    )

    return res || ''
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
