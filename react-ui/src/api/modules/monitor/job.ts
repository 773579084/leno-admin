import { http } from '@/api'
import {
  IjobType,
  IsuccessTypeAPI,
  IgetDetailTypeAPI,
  IgetListAPI,
  IjobDetailType,
} from '@/type/modules/monitor/job'

// 查询列表
export const getListAPI = (data: IjobType) => {
  return http<IgetListAPI>('GET', '/monitor/job/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/monitor/job/' + ids)
}

// 新增
export const addAPI = (data: IjobDetailType) => {
  return http<IsuccessTypeAPI>('POST', '/monitor/job', data)
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<IgetDetailTypeAPI>('GET', '/monitor/job/detail/' + id)
}

// 修改
export const putAPI = (data: IjobDetailType) => {
  return http<IsuccessTypeAPI>('PUT', '/monitor/job', data)
}

// 立即执行一次
export const runOneAPI = (data: IjobDetailType) => {
  return http<IsuccessTypeAPI>('PUT', '/monitor/job/run', data)
}

// 修改状态
export const putStatusAPI = (data: IjobDetailType) => {
  return http<IsuccessTypeAPI>('PUT', '/monitor/job/status', data)
}
