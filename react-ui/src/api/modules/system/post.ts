import { http } from '@/api'
import {
  IpostType,
  IsuccessTypeAPI,
  IgetDetailTypeAPI,
  IgetListAPI,
} from '@/type/modules/system/post'

// 查询列表
export const getListAPI = (data: IpostType) => {
  return http<IgetListAPI>('GET', '/system/post/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/system/post/' + ids)
}

// 新增
export const addAPI = (data: IpostType) => {
  return http<IsuccessTypeAPI>('POST', '/system/post', data)
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<IgetDetailTypeAPI>('GET', '/system/post/detail/' + id)
}

// 修改
export const putAPI = (data: IpostType) => {
  return http<IsuccessTypeAPI>('PUT', '/system/post', data)
}
