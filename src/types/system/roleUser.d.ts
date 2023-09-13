/* global OpTypes */
// 后端 类型文件
export interface IroleUserQueryType {
  pageNum: number;
  pageSize: number;
  userId?: number;
  roleId?: string;
  deptId?: number;
  userName?: string;
  nickName?: string;
  userType?: string;
  email?: string;
  phonenumber?: string;
  sex?: string;
  avatar?: string;
  password?: string;
  status?: string;
  delFlag?: number;
  loginIp?: string;
  loginDate?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IroleUserQuerySerType {
  user_id?: { [OpTypes.in]: string[] };
  pageNum: number;
  pageSize: number;
  user_name?: { [OpTypes.like]: string };
  phonenumber?: { [OpTypes.like]: string };
  del_flag?: string;
}

export interface IroleUserSer {
  user_id?: number;
  dept_id?: number;
  user_name?: string;
  nick_name?: string;
  user_type?: string;
  email?: string;
  phonenumber?: string;
  sex?: string;
  avatar?: string;
  password?: string;
  status?: string;
  del_flag?: number;
  login_ip?: string;
  login_date?: string;
  create_by?: string;
  update_by?: string;
  remark?: string;
  created_at?: string;
  updated_at?: string;
}

// 新增 用户与角色关系
export interface IaddUserRoleType {
  roleId: string;
  userId: string;
}

export interface IaddUserRoleSerType {
  role_id: string;
  user_id: string;
}

// 获取角色 绑定的用户
export interface IRoleBindUserType {
  pageNum: number;
  pageSize: number;
  role_id: string;
}

// sys_user query
export interface ISelectUserQueryType {
  pageNum: number;
  pageSize: number;
  roleId?: string;
  deptId?: number;
  userName?: string;
  phonenumber?: string;
  status?: string;
  beginTime?: string;
  endTime?: string;
}
