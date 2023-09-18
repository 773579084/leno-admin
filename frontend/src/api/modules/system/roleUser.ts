import { http } from '@/api';
import { IroleUserType, IsuccessTypeAPI, IgetListAPI, IaddUserRoleType } from '@/type/modules/system/roleUser';

// 查询角色绑定的用户列表
export const getListAPI = (data: IroleUserType) => http<IgetListAPI>('GET', '/system/roleUser/list', data);

// 取消授权
export function delAPI(data: { roleId: string; userId: string }) {
  return http<IsuccessTypeAPI>('DELETE', '/system/roleUser/authorization', data);
}

// 新增 用户与角色关系
export const addAPI = (data: IaddUserRoleType) => http<IsuccessTypeAPI>('post', '/system/roleUser/authorization', data);

// 选择用户列表
export const getUnallocatedListAPI = (data: IroleUserType) => http<IgetListAPI>('GET', '/system/roleUser/unallocatedList', data);
