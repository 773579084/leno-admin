import { deptType } from './system'

export interface userType {
  userId?: number
  deptId?: number
  userName?: string
  nickName?: string
  userType?: boolean | number
  email?: string
  phonenumber?: number
  sex?: boolean | number
  avatar?: string
  password?: string
  status?: boolean | number
  delFlag?: boolean | number
  loginIp?: string
  loginDate?: string | number
  createBy?: string
  updateBy?: string
  remark?: string
  iat?: string
  exp?: string
  createdAt?: string | null
  updatedAt?: string | null
  dept?: deptType
  postIds?: number[]
  roleIds?: number[]
}

export interface userListType {
  count: number
  rows: userType[]
}

export interface pwdType {
  oldPwd?: string
  newPwd?: string
}

export interface imgType {
  filepath?: string
  mimetype?: string
  size?: number
}
