export const excelMap = {
  user: {
    用户编号: 'user_id',
    部门编号: 'dept_id',
    登录名称: 'user_name',
    用户昵称: 'nick_name',
    用户邮箱: 'email',
    手机号码: 'phonenumber',
    用户性别: 'sex',
    帐号状态: 'status'
  },
  changDict: {
    sex: {
      男: '0',
      女: '1',
      未知: '2'
    },
    status: {
      正常: '0',
      停用: '1'
    }
  },
  changDictExport: {
    sex: {
      '0': '男',
      '1': '女',
      '2': '未知'
    },
    status: {
      '0': '正常',
      '1': '停用'
    }
  }
}

export const excelExportMap = {
  userHeader: [
    '用户序号',
    '登录名称',
    '用户邮箱',
    '手机号码',
    '用户性别',
    '帐号状态',
    '最后登录IP',
    '最后登录时间',
    '部门名称',
    '部门负责人'
  ],
  userHeaderKeys: [
    'userId',
    'userName',
    'email',
    'phonenumber',
    'sex',
    'status',
    'loginIp',
    'loginDate',
    'dept.deptName',
    'dept.leader'
  ]
}
