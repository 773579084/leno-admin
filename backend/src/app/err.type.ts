/** code 代表含义
 * 400 => 表示前端传参可能出现错误
 * 401 => 权限过期
 * 403 => 无访问权限
 * 500 => 服务器拒绝请求
 */
export default {
  // 登录注册
  InvalidConnectionError: {
    code: '400',
    message: '密码错误',
  },
  userExisting: {
    code: '400',
    message: '用户名已存在',
  },
  userStatusErr: {
    code: '400',
    message: '用户账号已被停用，请联系管理人员',
  },
  userRegisterError: {
    code: '400',
    message: '用户注册错误',
  },
  userDoesNotExist: {
    code: '400',
    message: '用户不存在',
  },
  userLoginError: {
    code: '400',
    message: '用户登录失败',
  },
  invalidPassword: {
    code: '400',
    message: '密码不匹配',
  },
  invalidToken: {
    code: '401',
    message: '无效的token',
  },
  FormatWrongErr: {
    code: '400',
    message: '格式错误',
  },
  enteredPasswordsDiffer: {
    code: '400',
    message: '新旧密码不一致',
  },
  reviseErr: {
    code: '400',
    message: '修改信息失败',
  },
  updateAvatarErr: {
    code: '400',
    message: '用户头像上传失败',
  },
  unSupportedFileErr: {
    code: '400',
    message: '图片上传格式错误,请上传jpeg/png格式',
  },
  unAvatarSizeErr: {
    code: '400',
    message: '图片超过大小限制',
  },
  getUserInfoErr: {
    code: '400',
    message: '用户获取个人信息失败',
  },
  // 用户管理
  getUserListErr: {
    code: '400',
    message: '获取用户列表失败',
  },
  checkUserIdErr: {
    code: '400',
    message: '用户名id格式错误',
  },
  getDeptTreeErr: {
    code: '400',
    message: '查询部门失败',
  },
  addUserErr: {
    code: '400',
    message: '请检查新增用户传参',
  },
  putUserErr: {
    code: '400',
    message: '请检查新增用户传参',
  },
  getPostRoleErr: {
    code: '500',
    message: '查询部门角色失败',
  },
  checkPwdErr: {
    code: '400',
    message: '请检查密码传参',
  },
  delUserErr: {
    code: '500',
    message: '删除用户失败',
  },
  delSuperUserErr: {
    code: '500',
    message: '超级管理员不可删除！',
  },
  exportUserListErr: {
    code: '500',
    message: '导出用户列表错误',
  },
  importUserListErr: {
    code: '400',
    message: '用户excel上传表头格式不正确',
  },
  // 菜单管理
  getRoutersErr: {
    code: '400',
    message: '获取菜单路由失败',
  },
  // 统一报错提醒（服务于简单模块和代码生成）
  getListErr: {
    code: '500',
    message: '获取列表失败',
  },
  checkIdsErr: {
    code: '400',
    message: 'id格式错误',
  },
  addErr: {
    code: '500',
    message: '新增失败',
  },
  delErr: {
    code: '500',
    message: '删除失败',
  },
  sqlErr: {
    code: '500',
    message: '服务器内部错误',
  },
  redisErr: {
    code: '500',
    message: 'redis内部错误',
  },
  verifyErr: {
    code: '400',
    message: '内容已存在',
  },
  uploadParamsErr: {
    code: '400',
    message: '请检查上传传参',
  },
  exportExcelErr: {
    code: '500',
    message: '导出excel失败',
  },
  uploadImageErr: {
    code: '500',
    message: '上传图片失败',
  },
  uploadFilesErr: {
    code: '500',
    message: '上传文件失败',
  },
  importErr: {
    code: '500',
    message: '导入失败',
  },
  accessAuthErr: {
    code: '403',
    message: '无访问权限',
  },
  logErr: {
    code: '500',
    message: '日志写入失败',
  },
  stopEditErr: {
    code: '500',
    message: '演示模式，不允许操作',
  },
};
