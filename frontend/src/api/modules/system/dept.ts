import { http } from '@/api';
import { IdeptType, IsuccessTypeAPI, IgetDetailTypeAPI, IgetListAPI } from '@/type/modules/system/dept';

// 查询列表
export const getListAPI = (data?: IdeptType) => http<IgetListAPI>('GET', '/system/dept/list', data);

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', `/system/dept/${ids}`);
}

// 新增
export const addAPI = (data: IdeptType) => http<IsuccessTypeAPI>('POST', '/system/dept', data);

// 获取详细数据
export const getDetailAPI = (id: number) => http<IgetDetailTypeAPI>('GET', `/system/dept/detail/${id}`);

// 修改
export const putAPI = (data: IdeptType) => http<IsuccessTypeAPI>('PUT', '/system/dept', data);
