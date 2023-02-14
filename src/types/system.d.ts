// 基础菜单类型
export interface menusType {
  menu_id: string
  menu_name: string
  parent_id: string
  order_num: string
  path: string
  component: string
  query: string
  is_frame: string
  is_cache: string
  menu_type: string
  visible: string
  status: string
  perms: string
  icon: string
  create_by: string
  update_by: string
  remark: string
  createdAt: string
  updatedAt: string
}

// 部门类型
export interface deptType {
  dept_id: number
  parent_id: number
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

export interface Post {
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

export interface Role {
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
  sex: number
  avatar?: any
  status: number
  remark?: any
  createdAt: string
  updatedAt: string
  postIds: number[]
  posts: Post[]
  roleIds: number[]
  roles: Role[]
  userId: number
  deptId?: any
  userName: string
  nickName: string
  userType: number
  delFlag: number
  loginIp?: any
  loginDate?: any
  createBy?: any
  updateBy?: any
}
