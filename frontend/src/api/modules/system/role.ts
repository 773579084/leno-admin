import { http } from '@/api';
import { IroleType, IsuccessTypeAPI, IgetDetailTypeAPI, IgetListAPI } from '@/type/modules/system/role';

// 查询列表
export const getListAPI = (data: IroleType) => http<IgetListAPI>('GET', '/system/role/list', data);

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', `/system/role/${ids}`);
}

// 新增
export const addAPI = (data: IroleType) => http<IsuccessTypeAPI>('POST', '/system/role', data);

// 获取详细数据
export const getDetailAPI = (id: number) => http<IgetDetailTypeAPI>('GET', `/system/role/${id}`);

// 修改
export const putAPI = (data: IroleType) => http<IsuccessTypeAPI>('PUT', '/system/role', data);

// 修改角色状态
export const putRoleStatusAPI = (data: { status: string; id: number }) => http<IsuccessTypeAPI>('PUT', '/system/role/status', data);
