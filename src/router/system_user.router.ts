import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import {
  importExcelsMid,
  judegImportMid,
  exportExcelMid,
  importExcelDictMapMid
} from '@/middleware/common.middleware'
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
import { exportUserListSer } from '@/service/system/user.service'
import User from '@/model/user.model'
const router = new Router({ prefix: '/system' })

// #region 用户管理
// 查询列表用户
router.get('/user/list', getUserListMid, formatHandle, getUserListCon)

// 删除用户
router.delete(`/user/:id`, userIdSchema, delUserCon)

// 查询部门下拉树结构
router.get('/dept/treeselect', deptTreeMid, formatHandle, getdeptTreeCon)

// 获取用户的角色与部门关联信息
router.get('/user', getPostRoleMid, formatHandle, getPostRoleCon)

// 新增用户
router.post('/user', addUserSchema, verifyUser, crptyPassword, getAddUserMid, getAddUserCon)

// 修改用户密码
router.put('/user/updatePwd', updatePwdMid, updatePwdCon)

// 获取用户个人详细数据
router.get(`/userInfo/:id`, userInfoMid, formatHandle, userInfoCon)

// 修改用户
router.put('/user', putUserSchema, putUserMid, putUserCon)

// 修改用户状态
router.put('/user/profile', putUserStatusMid, putUserStatusCon)
// #endregion

// 导出用户列表
router.post(
  '/user/export',

  exportExcelMid(exportUserListSer, { status: 'sys_normal_disable', sex: 'sys_user_sex' }),
  exportUserListCon
)

// 导入用户列表
router.post(
  '/user/importExcel',

  importExcelDictMapMid({ status: 'sys_normal_disable', sex: 'sys_user_sex' }),
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
router.post('/user/importTemplate', exportTemlateCon)

module.exports = router
