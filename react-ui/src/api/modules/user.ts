import { http } from '@/api'
import {
  ILoginApi,
  IRegisterApi,
  ILogin,
  IProfileAvatar,
  IGetUserInfoAPI,
  IChangePwd,
  IsucceeMes,
  IUserProp,
  IprofileAPI,
  ICaptchaImageApi,
} from '@/type'
import { getRouterApiType } from '@/type/modules/system/menu'

// 登录
export const loginAPI = (data: ILogin) => {
  return http<ILoginApi>('POST', '/user/login', data)
}

// 注册
export const registerAPI = (data: ILogin) => {
  return http<IRegisterApi>('POST', '/user/register', data)
}

// 验证图片
export const captchaImageAPI = () => {
  return http<ICaptchaImageApi>('GET', '/user/captchaImage')
}

// 退出登录
export const logoutAPI = () => {
  return http<IsucceeMes>('DELETE', '/user/logout')
}

// 获取路由
export const getRoutersAPI = () => {
  return http<getRouterApiType>('GET', '/user/menu/getRouters')
}

// 获取用户信息(包含权限)
export const getUserAPI = () => {
  return http<IGetUserInfoAPI>('GET', '/user/getInfo')
}

// 获取用户信息
export const getProfileAPI = () => {
  return http<IprofileAPI>('GET', '/user/profile')
}

// 头像上传
export const uploadAvatarAPI = (data: FormData) => {
  return http<IProfileAvatar>('POST', '/user/profile/avatar', data)
}

// 修改密码
export const updatePwdAPI = (data: IChangePwd) => {
  return http<IsucceeMes>('PUT', '/user/profile/updatePwd', data)
}

// 修改个人基本信息
export const updateUserInfoAPI = (data: IUserProp) => {
  return http<IsucceeMes>('PUT', '/user/profile', data)
}
