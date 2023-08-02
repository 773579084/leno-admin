import { http } from '@/api'
import { IgetListAPI, IroleType } from '@/type/modules/system/role'
import { IsuccessTypeAPI, IputUserAuthParamType } from '@/type/modules/system/userAuth'

// 查询 角色 列表
export const getListAPI = (data: IroleType) => {
  return http<IgetListAPI>('GET', '/system/userAuth/role/list', data)
}

// 设置 用户 角色信息
export const putUserAuthAPI = (data: IputUserAuthParamType) => {
  return http<IsuccessTypeAPI>('PUT', '/system/user/userAuth', data)
}
