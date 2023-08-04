import { http } from '@/api'
import { IlogininforType, IsuccessTypeAPI, IgetListAPI } from '@/type/modules/system/logininfor'

// 查询列表
export const getListAPI = (data: IlogininforType) => {
  return http<IgetListAPI>('GET', '/system/logMan/logininfor/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/system/logMan/logininfor/' + ids)
}

// 清空
export function cleanAPI() {
  return http<IsuccessTypeAPI>('DELETE', '/system/logMan/logininfor/clean')
}
