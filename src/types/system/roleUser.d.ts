// 后端 类型文件
export interface IroleUserQueryType {
  pageNum: number
  pageSize: number
  userId?: number
  deptId?: number
  userName?: string
  nickName?: string
  userType?: string
  email?: string
  phonenumber?: string
  sex?: string
  avatar?: string
  password?: string
  status?: string
  delFlag?: number
  loginIp?: string
  loginDate?: string
  createBy?: string
  updateBy?: string
  remark?: string
  createdAt?: date
  updatedAt?: date
}

export interface IroleUserQuerySerType {
  pageNum: number
  pageSize: number
  user_name?: { [OpTypes.like]: string }
  phonenumber?: { [OpTypes.like]: string }
}

export interface IroleUser {}

export interface IroleUserSer {
  user_id?: number
  dept_id?: number
  user_name?: string
  nick_name?: string
  user_type?: string
  email?: string
  phonenumber?: string
  sex?: string
  avatar?: string
  password?: string
  status?: string
  del_flag?: number
  login_ip?: string
  login_date?: string
  create_by?: string
  update_by?: string
  remark?: string
  created_at?: date
  updated_at?: date
}

// 新增 用户与角色关系
export interface IaddUserRoleType {
  roleId: string
  userId: string
}

export interface IaddUserRoleSerType {
  role_id: string
  user_id: string
}
