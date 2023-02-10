/** code 代表含义
 * 400 => 表示前端传参可能出现错误
 * 401 => 无权限
 * 403 => 服务器拒绝请求
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
  invalidRefreshToken: {
    code: '401',
    message: '无效的RefreshToken',
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
  sqlErr: {
    code: '403',
    message: '服务器查询出错',
    result: ''
  },

  // 菜单管理
  getRoutersErr: {
    code: '400',
    message: '获取菜单路由失败',
    result: ''
  }
}
