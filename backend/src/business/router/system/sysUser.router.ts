import Router from 'koa-router';
// 格式转换
import { formatHandle, importExcelsMid, judegImportMid, exportExcelMid, importExcelDictMapMid } from '@/business/middleware/common/common.middleware';
import {
  getUserListMid,
  deptTreeMid,
  getAddUserMid,
  getPostRoleMid,
  userInfoMid,
  updatePwdMid,
  putUserMid,
  putUserStatusMid,
  delMid,
  exportMid,
  exportTemMid,
  importExcelUserCon,
} from '@/business/middleware/system/user.middleware';
import { verifyUserMid, crptyPasswordMid } from '@/business/middleware/user.middleware';
import IndexCon from '@/business/controller';
import { exportUserListSer } from '@/business/service/system/user.service';
import LenoUser from '@/mysql/model/user.model';
import { judgeIdSchema, addEditSchema } from '@/business/schema';
import { addUserJudg, putUserJudg } from '@/business/schema/system/sys_user.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system' });
// #region 用户管理
// 查询列表用户
router.get('/user/list', hasPermi('system:user:query'), getUserListMid, formatHandle, IndexCon());

// 删除用户
router.delete('/user/:id', hasPermi('system:user:remove'), judgeIdSchema(), delMid, IndexCon());

// 查询部门下拉树结构
router.get('/dept/treeselect', hasPermi('system:user:query'), deptTreeMid, formatHandle, IndexCon());

// 获取用户的角色与岗位关联信息
router.get('/user', getPostRoleMid, hasPermi('system:user:query'), formatHandle, IndexCon());

// 新增用户
router.post('/user', hasPermi('system:user:add'), addEditSchema(addUserJudg), verifyUserMid, crptyPasswordMid, getAddUserMid, IndexCon());

// 修改用户密码
router.put('/user/updatePwd', hasPermi('system:user:resetPwd'), updatePwdMid, IndexCon());

// 获取用户个人详细数据
router.get('/userInfo/:id', hasPermi('system:user:query'), userInfoMid, formatHandle, IndexCon());

// 修改用户
router.put('/user', hasPermi('system:user:edit'), addEditSchema(putUserJudg), putUserMid, IndexCon());

// 修改用户状态
router.put('/user/profile', hasPermi('system:user:edit'), putUserStatusMid, IndexCon());
// #endregion

// 导出用户列表
router.post(
  '/user/export',
  hasPermi('system:user:export'),
  exportExcelMid(exportUserListSer, LenoUser, {
    status: 'sys_normal_disable',
    sex: 'sys_user_sex',
  }),
  exportMid,
  IndexCon(),
);

// 导入用户列表
router.post(
  '/user/import',
  hasPermi('system:user:import'),
  importExcelDictMapMid({ status: 'sys_normal_disable', sex: 'sys_user_sex' }),
  importExcelsMid({ password: true }),
  importExcelUserCon,
  judegImportMid(LenoUser, ['dept_id', 'user_name', 'nick_name', 'email', 'phonenumber', 'sex', 'status']),
  IndexCon('用户信息导入成功'),
);

// 导出用户excel模板
router.post('/user/export/template', hasPermi('system:user:export'), exportTemMid, IndexCon());

export default router;
