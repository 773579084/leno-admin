import Router from 'koa-router'

import {
  login,
  register,
  updatePwd,
  updateUserInfo,
  updateAvatarCon,
  getUserInfoCon,
  refreshTokenCon
} from '@/controller/user.controller'
import {
  userInfoSchema,
  userSchema,
  loginValidator,
  verifyUser,
  crptyPassword,
  pwdSchema,
  isUserStatus
} from '@/middleware/user.middleware'
import { contrastFileSizeSchema, judImgFormatSchema } from '@/middleware/common.middleware'
import auth from '@/middleware/auth.middleware'
import refreshAuth from '@/middleware/refresh.middleware'

const router = new Router({ prefix: '/user' })

// 登录
router.post('/login', userSchema, isUserStatus, loginValidator, login)

// 注册
router.post('/register', userSchema, verifyUser, crptyPassword, register)

// 获取用户所有的个人信息
router.get('/profile/userInfo', auth, getUserInfoCon)

// 修改用户密码
router.put('/profile/updatePwd', auth, pwdSchema, updatePwd)

// 修改用户个人信息
router.put('/profile', auth, userInfoSchema, updateUserInfo)

// 用户头像上传
router.post(
  '/profile/avatar',
  auth,
  contrastFileSizeSchema(),
  judImgFormatSchema(),
  updateAvatarCon
)

// refresh token
router.get('/refresh', refreshAuth, refreshTokenCon)

module.exports = router
