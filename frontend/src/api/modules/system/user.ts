import { http } from '@/api';
import { IgetUserListAPI, ILimitAPI, IsucceeMes, IdeptTreeAPI, IgetAddUserAPI, userType, IgetPostRoleApi, IreturnApi } from '@/type';

// 查询用户列表
export const getUserListAPI = (data: ILimitAPI) => http<IgetUserListAPI>('GET', '/system/user/list', data);

// 删除用户
export function delUserAPI(userId: number | string) {
  return http<IsucceeMes>('DELETE', `/system/user/${userId}`);
}

// 查询部门下拉树结构
export const deptTreeAPI = () => http<IdeptTreeAPI>('GET', '/system/dept/treeselect');

// 岗位及角色数据获取
export const getPostRoleAPI = () => http<IgetPostRoleApi>('GET', '/system/user');

// 新增用户
export const addUserAPI = (data: userType) => http<IgetAddUserAPI>('POST', '/system/user', data);

// 修改用户密码信息
export const patchUserPwdAPI = (data: userType) => http<IreturnApi>('PUT', '/system/user/updatePwd', data);

// 获取用户个人详细数据
export const getUserInfoAPI = (userId: number | string) => http<IgetAddUserAPI>('GET', `/system/userInfo/${userId}`);

// 修改用户信息
export const putUserAPI = (data: userType) => http<IgetAddUserAPI>('PUT', '/system/user', data);

// 修改用户状态
export const putUserStatusAPI = (data: { status: string; userId: number }) => http<IgetAddUserAPI>('PUT', '/system/user/profile', data);

// 导入excel表
export const uploadExcelsAPI = (data: FormData) => http<IgetAddUserAPI>('POST', '/system/user/import', data);
