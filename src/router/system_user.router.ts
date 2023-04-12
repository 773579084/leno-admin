import Router from 'koa-router'
import auth from '@/middleware/auth.middleware'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { importExcelsMid, judegImportMid, exportExcelMid } from '@/middleware/common.middleware'
// user
import {
  getUserListCon,
  delUserCon,
  getdeptTreeCon,
  getAddUserCon,
  getPostRoleCon,
  updatePwdCon,
  userInfoCon,
  putUserCon,
  putUserStatusCon,
  exportUserListCon,
  exportTemlateCon,
  importExcelCon
} from '@/controller/system/user.controller'
import {
  getUserListMid,
  userIdSchema,
  deptTreeMid,
  getAddUserMid,
  getPostRoleMid,
  addUserSchema,
  userInfoMid,
  updatePwdMid,
  putUserSchema,
  putUserMid,
  putUserStatusMid
} from '@/middleware/system/user.middleware'
import { verifyUser, crptyPassword } from '@/middleware/user.middleware'
import { getRoutersCon } from '@/controller/system/menu.controller'
import { exportUserListSer } from '@/service/system/user.service'
import User from '@/model/user.model'
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
router.put('/user/updatePwd', auth, updatePwdMid, updatePwdCon)

// 获取用户个人详细数据
router.get(`/userInfo/:id`, auth, userInfoMid, formatHandle, userInfoCon)

// 修改用户
router.put('/user', auth, putUserSchema, putUserMid, putUserCon)

// 修改用户状态
router.put('/user/profile', auth, putUserStatusMid, putUserStatusCon)
// #endregion

// 新增用户弹窗内岗位及角色数据获取
router.get('/menu/getRouters', auth, putUserStatusMid, getRoutersCon)

// 导出用户列表
router.post(
  '/user/export',
  auth,
  exportExcelMid(exportUserListSer, { status: 'sys_normal_disable', sex: 'sys_user_sex' }),
  exportUserListCon
)

// 导入用户列表
router.post(
  '/user/importExcel',
  auth,
  importExcelsMid({ password: true }),
  importExcelCon,
  judegImportMid(User, [
    'dept_id',
    'user_name',
    'nick_name',
    'email',
    'phonenumber',
    'sex',
    'status'
  ])
)

// 导出用户excel模板
router.post('/user/importTemplate', auth, exportTemlateCon)

module.exports = router
