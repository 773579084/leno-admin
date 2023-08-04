import { http } from '@/api'
import {
  IdeptType,
  IsuccessTypeAPI,
  IgetDetailTypeAPI,
  IgetListAPI,
} from '@/type/modules/system/dept'

// 查询列表
export const getListAPI = (data?: IdeptType) => {
  return http<IgetListAPI>('GET', '/system/dept/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/system/dept/' + ids)
}

// 新增
export const addAPI = (data: IdeptType) => {
  return http<IsuccessTypeAPI>('POST', '/system/dept', data)
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<IgetDetailTypeAPI>('GET', '/system/dept/detail/' + id)
}

// 修改
export const putAPI = (data: IdeptType) => {
  return http<IsuccessTypeAPI>('PUT', '/system/dept', data)
}
