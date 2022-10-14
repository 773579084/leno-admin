import Router from 'koa-router'

import { login, register } from '../controller/user'
import { userValidator, verifyUser, crptyPassword } from '../middleware/user'

const router = new Router({ prefix: '/user' })

// 登录
router.post('/login', login)
// 注册
router.post('/register', userValidator, verifyUser, crptyPassword, register)

export default router
