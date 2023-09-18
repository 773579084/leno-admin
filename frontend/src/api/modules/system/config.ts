import { http } from '@/api';
import { IconfigType, IsuccessTypeAPI, IgetDetailTypeAPI, IgetListAPI, IqueryConfigTypeAPI } from '@/type/modules/system/config';

// 查询列表
export const getListAPI = (data: IconfigType) => http<IgetListAPI>('GET', '/system/config/list', data);

// 根据参数键名查询参数值
export const getConfigKeyAPI = (configKey: string) => http<IqueryConfigTypeAPI>('POST', '/system/config/configKey', { key: configKey });

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', `/system/config/${ids}`);
}

// 新增
export const addAPI = (data: IconfigType) => http<IsuccessTypeAPI>('POST', '/system/config', data);

// 获取详细数据
export const getDetailAPI = (id: number) => http<IgetDetailTypeAPI>('GET', `/system/config/detail/${id}`);

// 修改
export const putAPI = (data: IconfigType) => http<IsuccessTypeAPI>('PUT', '/system/config', data);
