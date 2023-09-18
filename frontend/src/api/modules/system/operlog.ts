import { http } from '@/api';
import { IoperlogType, IsuccessTypeAPI, IgetDetailTypeAPI, IgetListAPI } from '@/type/modules/system/operlog';

// 查询列表
export const getListAPI = (data: IoperlogType) => http<IgetListAPI>('GET', '/system/logMan/operlog/list', data);

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', `/system/logMan/operlog/${ids}`);
}

// 清空
export function cleanAPI() {
  return http<IsuccessTypeAPI>('DELETE', '/system/logMan/operlog/clean');
}

// 获取详细数据
export const getDetailAPI = (id: number) => http<IgetDetailTypeAPI>('GET', `/system/logMan/operlog/detail/${id}`);
