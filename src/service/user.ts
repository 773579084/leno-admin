import User from '../model/user'
import { userType } from '../types'

class UserService {
  // 注册
  async createdUser(user_name: string, password: string) {
    // 插入数据到数据库
    const res = (await User.create({ user_name, password })) as any

    return res.dataValues
  }

  // 查找数据是否有重复的用户名
  async getUserInfo({ id, user_name, password }: userType) {
    const whereOpt = {}

    // 判断传了那个数，就将那个数传入到 whereOpt中
    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })

    // 查找是否重复
    const res = (await User.findOne({
      attributes: ['id', 'user_name', 'password'],
      where: whereOpt
    })) as any

    console.log(30, res)

    return res ? res.dataValues : null
  }
}

const { createdUser, getUserInfo } = new UserService()

export { createdUser, getUserInfo }
