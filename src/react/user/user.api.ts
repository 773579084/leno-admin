import { http } from '@/api'
import {
  IuserType,
  IsuccessTypeAPI,
  IgetDetailTypeAPI,
  IgetListAPI
} from '@/type/modules/system/user'

// 查询列表
export const getListAPI = (data: IuserType) => {
  return http<IgetListAPI>('GET', '/system/user/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/system/user/' + ids)
}

// 新增
export const addAPI = (data: IuserType) => {
  return http<IsuccessTypeAPI>('POST', '/system/user', data)
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<IgetDetailTypeAPI>('GET', '/system/user/' + id)
}

// 修改
export const putAPI = (data: IuserType) => {
  return http<IsuccessTypeAPI>('PUT', '/system/user', data)
}