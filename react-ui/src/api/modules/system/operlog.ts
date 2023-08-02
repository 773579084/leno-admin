import { http } from '@/api'
import {
  IoperlogType,
  IsuccessTypeAPI,
  IgetDetailTypeAPI,
  IgetListAPI,
} from '@/type/modules/system/operlog'

// 查询列表
export const getListAPI = (data: IoperlogType) => {
  return http<IgetListAPI>('GET', '/system/operlog/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/system/operlog/' + ids)
}

// 清空
export function cleanAPI() {
  return http<IsuccessTypeAPI>('DELETE', '/system/operlog/clean')
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<IgetDetailTypeAPI>('GET', '/system/operlog/detail/' + id)
}
