import { http } from '@/api'
import { IjobLogType, IsuccessTypeAPI, IgetListAPI } from '@/type/modules/monitor/jobLog'

// 查询列表
export const getListAPI = (data: IjobLogType) => {
  return http<IgetListAPI>('GET', '/monitor/jobLog/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/monitor/jobLog/' + ids)
}

// 清空
export function cleanAPI() {
  return http<IsuccessTypeAPI>('DELETE', '/monitor/jobLog/clean')
}
