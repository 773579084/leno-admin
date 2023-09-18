// 登录form
export interface ILogin {
  userName?: string;
  password?: string;
  password2?: string;
  code?: string;
  uuid?: string;
}

// propstype
export interface userPropsType {
  toggleLogin?: boolean;
  changeIsLogin?: () => {
    /*  */
  };
}

// userInfo
export interface IChangePwd {
  confirmPwd?: string;
  newPwd?: string;
  oldPwd?: string;
}

// #region  login && registerAPI 接口返回值
export interface ILoginResult {
  token?: string;
  refreshToken?: string;
}
export interface registerResult {
  userId: number;
  userName: string;
}
export interface ILoginApi {
  code: number;
  message: string;
  result: ILoginResult;
}

export interface IRegisterApi {
  code: number;
  message: string;
  result: registerResult;
}

export interface IProfileAvatar {
  code: number;
  message: string;
  result: { avatarImg: string };
}

// 成功消息提醒
export interface IsucceeMes {
  code: number;
  message: string;
  result?: null;
}

// 返回的个人信息
export interface IuserInfo {
  userId?: number;
  deptId?: number;
  userName?: string;
  nickName?: string;
  userType?: boolean | number;
  email?: string;
  phonenumber?: number;
  sex?: boolean | number;
  avatar?: string;
  status?: boolean | number;
  delFlag?: boolean | number;
  loginIp?: string;
  loginDate?: string | number;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  iat?: string;
  exp?: string;
  createdAt?: string;
}

// #endregion

// props
export interface IUserProp {
  nickName?: string;
  phoneNumber?: string;
  email?: string;
  sex?: number;
}
export interface IcaptchaImageType {
  img: string;
  uuid: string;
}

export interface ICaptchaImageApi {
  code: number;
  message: string;
  result: IcaptchaImageType;
}
