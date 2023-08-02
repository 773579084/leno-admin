import { http } from '@/api'
import { IgetListAPI } from '@/type/modules/monitor/server'

// 查询列表
export const getListAPI = () => {
  return http<IgetListAPI>('GET', '/monitor/server/list')
}
