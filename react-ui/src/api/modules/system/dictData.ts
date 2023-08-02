import { http } from '@/api'
import {
  IgetListAPI,
  ILimitAPI,
  IsuccessTypeAPI,
  addType,
  IgetTypeAPI,
} from '@/type/modules/system/sysDictData'

// 查询字典类型列表
export const getListAPI = (data: ILimitAPI) => {
  return http<IgetListAPI>('GET', '/system/dictData/list', data)
}

// 删除字典类型
export function delTypeAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/system/dictData/' + ids)
}

// 新增字典类型
export const addTypeAPI = (data: addType) => {
  return http<IsuccessTypeAPI>('POST', '/system/dictData', data)
}

// 获取字典类型详细数据
export const getTypeAPI = (id: number) => {
  return http<IgetTypeAPI>('GET', '/system/dictData/' + id)
}

// 根据字典类型查询字典数据信息
export const getDictsApi = (dictType: string) => {
  return http<IgetTypeAPI>('GET', '/system/dictData/type/' + dictType)
}

// 修改字典类型
export const putTypeAPI = (data: addType) => {
  return http<IsuccessTypeAPI>('PUT', '/system/dictData', data)
}
