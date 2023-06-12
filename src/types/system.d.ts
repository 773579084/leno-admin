import { IroleSer } from '@/types/system/role'
import { IpostSer } from '@/types/system/post'

export interface IdeptType {
  deptId: number
  parentId: number
  ancestors: string
  deptName: string
  orderNum: number
  leader: string
  phone: string
  email: string
  status: string
  delFlag: string
  createBy: string
  updateBy: string
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
  posts: IpostSer[]
  roleIds: number[]
  roles: IroleSer[]
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
  user_name?: string | { [OpTypes.like]: string }
  phonenumber?: string | { [OpTypes.like]: string }
  status?: string
  beginTime?: string
  endTime?: string
  created_at?: any
}
