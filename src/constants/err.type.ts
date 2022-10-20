// 此code为自己规定 1 = 项目 00 为大模块 01 为大模块里面的小功能点
export default {
  InvalidConnectionError: {
    code: '10001',
    message: '密码错误',
    result: ''
  },
  userExisting: {
    code: '10002',
    message: '用户名已存在',
    result: ''
  },
  userRegisterError: {
    code: '10003',
    message: '用户注册错误',
    result: ''
  },
  userDoesNotExist: {
    code: '10004',
    message: '用户不存在',
    result: ''
  },
  userLoginError: {
    code: '10005',
    message: '用户登录失败',
    result: ''
  },
  invalidPassword: {
    code: '10006',
    message: '密码不匹配',
    result: ''
  },
  tokenExpiredError: {
    code: '10101',
    message: 'token已过期',
    result: ''
  },
  invalidToken: {
    code: '10102',
    message: '无效的token',
    result: ''
  },
  FormatWrongErr: {
    code: '10103',
    message: '格式错误',
    result: ''
  },
  enteredPasswordsDiffer: {
    code: '10104',
    message: '新旧密码不一致',
    result: ''
  },
  reviseErr: {
    code: '10105',
    message: '修改信息失败',
    result: ''
  },
  updateAvatarErr: {
    code: '10106',
    message: '用户头像上传失败',
    result: ''
  },
  unSupportedFileErr: {
    code: '10107',
    message: '图片上传格式错误,请上传jpeg/png格式',
    result: ''
  },
  unAvatarSizeErr: {
    code: '10107',
    message: '图片超过大小限制',
    result: ''
  },
  getUserInfoErr: {
    code: '10108',
    message: '用户获取个人信息失败',
    result: ''
  }
}
