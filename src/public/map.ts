export const excelMap = {
  // 备注 后期使用字典动态替换
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

export const userExcelHeader = [
  {
    title: '用户序号',
    dataIndex: 'user_id',
    width: 80
  },
  {
    title: '登录名称',
    dataIndex: 'user_name'
  },
  {
    title: '用户邮箱',
    dataIndex: 'email',
    width: 240
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
    dataIndex: 'login_ip'
  },
  {
    title: '最后登录时间',
    dataIndex: 'login_date'
  },
  {
    title: '部门名称',
    dataIndex: 'dept.dept_name'
  },
  {
    title: '部门负责人',
    dataIndex: 'dept.leader'
  }
]

export const dictTypeExcelHeader = [
  {
    title: '字典序号',
    dataIndex: 'dict_id',
    width: 80
  },
  {
    title: '字典名称',
    dataIndex: 'dict_name'
  },
  {
    title: '字典类型',
    dataIndex: 'dict_type'
  },
  {
    title: '帐号状态',
    dataIndex: 'status'
  }
]

export const dictDataExcelHeader = [
  {
    title: '字典序号',
    dataIndex: 'dict_code',
    width: 80
  },
  {
    title: '字典标签',
    dataIndex: 'dict_label'
  },
  {
    title: '字典键值',
    dataIndex: 'dict_value'
  },
  {
    title: '字典类型',
    dataIndex: 'dict_type'
  },
  {
    title: '帐号状态',
    dataIndex: 'status'
  }
]
