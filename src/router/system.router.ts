import Router from 'koa-router'
import auth from '@/middleware/auth.middleware'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
// user
import {
  getUserListCon,
  delUserCon,
  getdeptTreeCon,
  getAddUserCon,
  getPostRoleCon,
  updatePwdCon,
  userInfoCon
} from '@/controller/system/user.controller'
import {
  getUserListMid,
  userIdSchema,
  deptTreeMid,
  getAddUserMid,
  getPostRoleMid,
  addUserSchema,
  userInfoMid,
  updatePwdMid
} from '@/middleware/system/user.middleware'
import { verifyUser, crptyPassword } from '@/middleware/user.middleware'
// menu
import { getRoutersCon } from '@/controller/system/menu.controller'
import { getRouterMid } from '@/middleware/system/menu.middleware'
const router = new Router({ prefix: '/system' })

// #region 用户管理
// 查询列表用户
router.get('/user/list', auth, getUserListMid, formatHandle, getUserListCon)

// 删除用户
router.delete(`/user/:id`, auth, userIdSchema, delUserCon)

// 查询部门下拉树结构
router.get('/dept/treeselect', auth, deptTreeMid, formatHandle, getdeptTreeCon)

// 获取用户的角色与部门关联信息
router.get('/user', auth, getPostRoleMid, formatHandle, getPostRoleCon)

// 新增用户
router.post('/user', auth, addUserSchema, verifyUser, crptyPassword, getAddUserMid, getAddUserCon)

// 修改用户密码
router.patch('/user/updatePwd', auth, updatePwdMid, updatePwdCon)

// 获取用户个人详细数据
router.get(`/userInfo/:id`, auth, userInfoMid, formatHandle, userInfoCon)
// #endregion

// 新增用户弹窗内岗位及角色数据获取
router.get('/menu/getRouters', auth, getRouterMid, getRoutersCon)

module.exports = router
