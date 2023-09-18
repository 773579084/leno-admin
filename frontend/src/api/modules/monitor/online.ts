import { http } from '@/api';
import { IonlineType, IsuccessTypeAPI, IgetListAPI } from '@/type/modules/monitor/online';

// 查询列表
export const getListAPI = (data: IonlineType) => http<IgetListAPI>('GET', '/monitor/online/list', data);

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', `/monitor/online/logout/${ids}`);
}
