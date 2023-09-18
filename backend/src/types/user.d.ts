import { IdeptType } from './system';
import { IroleQueryType } from './system/role';

export interface userType {
  userId?: number;
  deptId?: number;
  userName?: string;
  nickName?: string;
  userType?: string;
  email?: string;
  phonenumber?: number;
  sex?: string;
  avatar?: string;
  password?: string;
  status?: string;
  delFlag?: string;
  loginIp?: string;
  loginDate?: string | number;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  iat?: string;
  exp?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  dept?: IdeptType;
  roles?: IroleQueryType[];
  postIds?: number[];
  roleIds?: number[];
}

export interface IuserInfoType {
  ip: string;
  address: string;
  browser: string;
  os: string;
  loginTime: string;
  userInfo: userType;
  permissions: string[];
  roles: string[];
  loginMes: any;
}

export interface userListType {
  count: number;
  rows: userType[];
}

export interface pwdType {
  oldPwd?: string;
  newPwd?: string;
}

export interface imgType {
  filepath?: string;
  mimetype?: string;
  size?: number;
}

export interface ILoginType {
  userName: string;
  password: string;
  password2: string;
  code: string;
  uuid: string;
}
