import { http } from '@/api'
import { menusType, ILimitAPI, otherApiType, menusApiType } from '@/type/modules/system/menu'

// 获取菜单列表
export const getListAPI = (data: ILimitAPI) => {
  return http<menusApiType>('GET', '/system/menu/list', data)
}

// 新增字典类型
export const addAPI = (data: menusType) => {
  return http<otherApiType>('POST', '/system/menu', data)
}

// 删除
export function delAPI(ids: string) {
  return http<otherApiType>('DELETE', '/system/menu/' + ids)
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<otherApiType>('GET', '/system/menu/' + id)
}

// 修改
export const putAPI = (data: menusType) => {
  return http<otherApiType>('PUT', '/system/menu', data)
}
