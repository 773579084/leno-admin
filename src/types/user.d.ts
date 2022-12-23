export interface userType {
  user_id?: number
  dept_id?: number
  user_name?: string
  nick_name?: string
  user_type?: boolean | number
  email?: string
  phonenumber?: number
  sex?: boolean | number
  avatar?: string
  password?: string
  status?: boolean | number
  del_flag?: boolean | number
  login_ip?: string
  login_date?: string | number
  create_by?: string
  update_by?: string
  remark?: string
  iat?: string
  exp?: string
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
