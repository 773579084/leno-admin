import { http } from '@/api';
import { ILoginApi, IRegisterApi, ILogin, IProfileAvatar, IGetUserInfoAPI, IChangePwd, IsucceeMes, IUserProp, IprofileAPI, ICaptchaImageApi } from '@/type';
import { getRouterApiType } from '@/type/modules/system/menu';

// 登录
export const loginAPI = (data: ILogin) => http<ILoginApi>('POST', '/user/login', data);

// 注册
export const registerAPI = (data: ILogin) => http<IRegisterApi>('POST', '/user/register', data);

// 验证图片
export const captchaImageAPI = () => http<ICaptchaImageApi>('GET', '/user/captchaImage');

// 退出登录
export const logoutAPI = () => http<IsucceeMes>('DELETE', '/user/logout');

// 获取路由
export const getRoutersAPI = () => http<getRouterApiType>('GET', '/user/menu/getRouters');

// 获取用户信息(包含权限)
export const getUserAPI = () => http<IGetUserInfoAPI>('GET', '/user/getInfo');

// 获取用户信息
export const getProfileAPI = () => http<IprofileAPI>('GET', '/user/profile');

// 头像上传
export const uploadAvatarAPI = (data: FormData) => http<IProfileAvatar>('POST', '/user/profile/avatar', data);

// 修改密码
export const updatePwdAPI = (data: IChangePwd) => http<IsucceeMes>('PUT', '/user/profile/updatePwd', data);

// 修改个人基本信息
export const updateUserInfoAPI = (data: IUserProp) => http<IsucceeMes>('PUT', '/user/profile', data);
