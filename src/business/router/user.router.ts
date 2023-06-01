import Router from 'koa-router'
import {
  loginValidatorMid,
  verifyUserMid,
  crptyPasswordMid,
  isUserStatusMid,
  registerMid,
  loginMid,
  getUserInfoMid,
  updatePwdMid,
  updateUserInfoMid,
  uploadAvatarMid,
  refreshTokenMid
} from '@/business/middleware/user.middleware'
import IndexCon from '@/business/controller'
import refreshAuth from '@/business/middleware/common/refresh'
import { userSchema, pwdSchema, userInfoSchema } from '@/business/schema/user.schema'
import { contrastFileSizeSchema, judImgFormatSchema } from '@/business/schema'

const router = new Router({ prefix: '/user' })
// 登录
router.post(
  '/login',
  userSchema,
  isUserStatusMid,
  loginValidatorMid,
  loginMid,
  IndexCon('用户登录成功！')
)

// 注册
router.post(
  '/register',
  userSchema,
  verifyUserMid,
  crptyPasswordMid,
  registerMid,
  IndexCon('注册成功！')
)

// 获取用户所有的个人信息
router.get('/profile/userInfo', getUserInfoMid, IndexCon('用户获取个人信息成功！'))

// 修改用户密码
router.put('/profile/updatePwd', pwdSchema, updatePwdMid, IndexCon('密码修改成功！'))

// 修改用户个人信息
router.put('/profile', userInfoSchema, updateUserInfoMid, IndexCon())

// 用户头像上传
router.post(
  '/profile/avatar',
  contrastFileSizeSchema(),
  judImgFormatSchema(),
  uploadAvatarMid,
  IndexCon('用户上传头像成功！')
)

// refresh token
router.get('/refresh', refreshAuth, refreshTokenMid, IndexCon('token状态刷新成功！'))

module.exports = router
