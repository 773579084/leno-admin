// 部门类型
export interface deptType {
  [x: string]: any
  dept_id: number
  parent_id: number
  ancestors: string
  dept_name: string
  order_num: number
  leader: string
  phone: string
  email: string
  status: string
  del_flag: string
  create_by: string
  update_by: string
  createdAt: string
  updatedAt: string
}
export interface SysPost {
  status: string
  remark?: any
  createdAt: string
  updatedAt: string
  postId: number
  postCode: string
  postName: string
  postSort: number
  delFlag: string
  createBy: string
  updateBy?: any
}
export interface SysRole {
  status: string
  remark: string
  createdAt: string
  updatedAt: string
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope: string
  menuCheckStrictly: number
  deptCheckStrictly: number
  delFlag: string
  createBy: string
  updateBy?: any
}
export interface IUserDetail {
  email?: any
  phonenumber?: any
  sex: string
  avatar?: any
  status: string
  remark?: string
  createdAt: string
  updatedAt: string
  postIds: number[]
  posts: SysPost[]
  roleIds: number[]
  roles: SysRole[]
  userId: number
  deptId?: number
  userName: string
  nickName: string
  userType: number
  delFlag: number
  loginIp?: any
  loginDate?: any
  createBy?: any
  updateBy?: any
}

// sys_user query
export interface userQueryType {
  pageNum: number
  pageSize: number
  deptId?: number
  userName?: string
  phonenumber?: string
  status?: string
  beginTime?: string
  endTime?: string
}
export interface userQuerySerType {
  pageNum: number
  pageSize: number
  dept_id?: number[]
  user_name?: string
  phonenumber?: string
  status?: string
  beginTime?: string
  endTime?: string
  created_at?: any
}
