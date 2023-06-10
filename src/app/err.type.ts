/** code 代表含义
 * 400 => 表示前端传参可能出现错误
 * 401 => 无权限
 * 500 => 服务器拒绝请求
 */
export default {
  // 登录注册
  InvalidConnectionError: {
    code: '400',
    message: '密码错误',
    result: ''
  },
  userExisting: {
    code: '400',
    message: '用户名已存在',
    result: ''
  },
  userStatusErr: {
    code: '400',
    message: '用户账号已被停用，请联系管理人员',
    result: ''
  },
  userRegisterError: {
    code: '400',
    message: '用户注册错误',
    result: ''
  },
  userDoesNotExist: {
    code: '400',
    message: '用户不存在',
    result: ''
  },
  userLoginError: {
    code: '400',
    message: '用户登录失败',
    result: ''
  },
  invalidPassword: {
    code: '400',
    message: '密码不匹配',
    result: ''
  },
  invalidToken: {
    code: '401',
    message: '无效的token',
    result: ''
  },
  FormatWrongErr: {
    code: '400',
    message: '格式错误',
    result: ''
  },
  enteredPasswordsDiffer: {
    code: '400',
    message: '新旧密码不一致',
    result: ''
  },
  reviseErr: {
    code: '400',
    message: '修改信息失败',
    result: ''
  },
  updateAvatarErr: {
    code: '400',
    message: '用户头像上传失败',
    result: ''
  },
  unSupportedFileErr: {
    code: '400',
    message: '图片上传格式错误,请上传jpeg/png格式',
    result: ''
  },
  unAvatarSizeErr: {
    code: '400',
    message: '图片超过大小限制',
    result: ''
  },
  getUserInfoErr: {
    code: '400',
    message: '用户获取个人信息失败',
    result: ''
  },
  // 用户管理
  getUserListErr: {
    code: '400',
    message: '获取用户列表失败',
    result: ''
  },
  checkUserIdErr: {
    code: '400',
    message: '用户名id格式错误',
    result: ''
  },
  getDeptTreeErr: {
    code: '400',
    message: '查询部门失败',
    result: ''
  },
  addUserErr: {
    code: '400',
    message: '请检查新增用户传参',
    result: ''
  },
  putUserErr: {
    code: '400',
    message: '请检查新增用户传参',
    result: ''
  },
  getPostRoleErr: {
    code: '500',
    message: '查询部门角色失败',
    result: ''
  },
  checkPwdErr: {
    code: '400',
    message: '请检查密码传参',
    result: ''
  },
  delUserErr: {
    code: '500',
    message: '删除用户失败',
    result: ''
  },
  delSuperUserErr: {
    code: '500',
    message: '超级管理员不可删除！',
    result: ''
  },
  exportUserListErr: {
    code: '500',
    message: '导出用户列表错误',
    result: ''
  },
  importUserListErr: {
    code: '400',
    message: '用户excel上传表头格式不正确',
    result: ''
  },
  // 菜单管理
  getRoutersErr: {
    code: '400',
    message: '获取菜单路由失败',
    result: ''
  },
  // 统一报错提醒（服务于简单模块和代码生成）
  getListErr: {
    code: '500',
    message: '获取列表失败'
  },
  checkIdsErr: {
    code: '400',
    message: 'id格式错误',
    result: ''
  },
  addErr: {
    code: '500',
    message: '新增失败',
    result: ''
  },
  delErr: {
    code: '500',
    message: '删除失败',
    result: ''
  },
  sqlErr: {
    code: '500',
    message: '服务器内部错误',
    result: ''
  },
  redisErr: {
    code: '500',
    message: 'redis内部错误',
    result: ''
  },
  verifyErr: {
    code: '400',
    message: '内容已存在',
    result: ''
  },
  uploadParamsErr: {
    code: '400',
    message: '请检查上传传参',
    result: ''
  },
  exportExcelErr: {
    code: '500',
    message: '导出excel失败',
    result: ''
  },
  uploadImageErr: {
    code: '500',
    message: '上传图片失败',
    result: ''
  },
  uploadFilesErr: {
    code: '500',
    message: '上传文件失败',
    result: ''
  },
  importErr: {
    code: '500',
    message: '导入失败',
    result: ''
  },
  accessAuthErr: {
    code: '403',
    message: '无访问权限',
    result: ''
  }
}
