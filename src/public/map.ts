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

export const excelBaseStyle = {
  font: {
    size: 10,
    bold: true,
    color: { argb: 'ffffff' }
  },
  alignment: { vertical: 'middle', horizontal: 'center' },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '808080' }
  },
  border: {
    top: { style: 'thin', color: { argb: '9e9e9e' } },
    left: { style: 'thin', color: { argb: '9e9e9e' } },
    bottom: { style: 'thin', color: { argb: '9e9e9e' } },
    right: { style: 'thin', color: { argb: '9e9e9e' } }
  }
}

export const templateHeader = [
  {
    title: '用户序号',
    dataIndex: 'userId'
  },
  {
    title: '登录名称',
    dataIndex: 'userName'
  },
  {
    title: '用户邮箱',
    dataIndex: 'email'
  },
  {
    title: '手机号码',
    dataIndex: 'phonenumber'
  },
  {
    title: '用户性别',
    dataIndex: 'sex'
  },
  {
    title: '帐号状态',
    dataIndex: 'status'
  },
  {
    title: '最后登录IP',
    dataIndex: 'loginIp'
  },
  {
    title: '最后登录时间',
    dataIndex: 'loginDate'
  },
  {
    title: '部门名称',
    dataIndex: 'dept.deptName'
  },
  {
    title: '部门负责人',
    dataIndex: 'dept.leader'
  }
]
