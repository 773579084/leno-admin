import { http } from '@/api';
import { menusType, ILimitAPI, otherApiType, menusApiType } from '@/type/modules/system/menu';

// 获取菜单列表
export const getListAPI = (data: ILimitAPI) => http<menusApiType>('GET', '/system/menu/list', data);

// 新增字典类型
export const addAPI = (data: menusType) => http<otherApiType>('POST', '/system/menu', data);

// 删除
export function delAPI(ids: string) {
  return http<otherApiType>('DELETE', `/system/menu/${ids}`);
}

// 获取详细数据
export const getDetailAPI = (id: number) => http<otherApiType>('GET', `/system/menu/${id}`);

// 修改
export const putAPI = (data: menusType) => http<otherApiType>('PUT', '/system/menu', data);
