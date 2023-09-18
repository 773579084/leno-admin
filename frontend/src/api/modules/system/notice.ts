import { http } from '@/api';
import { InoticeType, IsuccessTypeAPI, IgetDetailTypeAPI, IgetListAPI } from '@/type/modules/system/notice';

// 查询列表
export const getListAPI = (data: InoticeType) => http<IgetListAPI>('GET', '/system/notice/list', data);

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', `/system/notice/${ids}`);
}

// 新增
export const addAPI = (data: InoticeType) => http<IsuccessTypeAPI>('POST', '/system/notice', data);

// 获取详细数据
export const getDetailAPI = (id: number) => http<IgetDetailTypeAPI>('GET', `/system/notice/detail/${id}`);

// 修改
export const putAPI = (data: InoticeType) => http<IsuccessTypeAPI>('PUT', '/system/notice', data);
