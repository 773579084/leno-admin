
  // 后端 类型文件
export interface IuserQueryType {
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
  createdAt?: string
  updatedAt?: string
}

export interface IuserQuerySerType {
  pageNum: number
  pageSize: number
}

export interface Iuser {
}

export interface IuserSer {
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
  created_at?: string
  updated_at?: string
}