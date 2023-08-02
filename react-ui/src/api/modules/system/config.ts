import { http } from '@/api'
import {
  IconfigType,
  IsuccessTypeAPI,
  IgetDetailTypeAPI,
  IgetListAPI,
} from '@/type/modules/system/config'

// 查询列表
export const getListAPI = (data: IconfigType) => {
  return http<IgetListAPI>('GET', '/system/config/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/system/config/' + ids)
}

// 新增
export const addAPI = (data: IconfigType) => {
  return http<IsuccessTypeAPI>('POST', '/system/config', data)
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<IgetDetailTypeAPI>('GET', '/system/config/detail/' + id)
}

// 修改
export const putAPI = (data: IconfigType) => {
  return http<IsuccessTypeAPI>('PUT', '/system/config', data)
}
