import { http } from '@/api'
import { IsuccessTypeAPI } from '@/type'
import { GenType, ICodePreviewAPI, IgetListAPI, ILimitAPI } from '@/type/modules/tool/gen'

// 查询db列表
export const getDbListAPI = (data: ILimitAPI) => {
  return http<IgetListAPI>('GET', '/tool/gen/db/list', data)
}

// 查询sql列表
export const getSqlListAPI = () => {
  return http<IgetListAPI>('GET', '/tool/gen/sql/list')
}

// 导入表
export const importTableAPI = (tables: string) => {
  return http<IsuccessTypeAPI>('POST', '/tool/gen/import/' + tables)
}

// 查询列表
export const getListAPI = (data: ILimitAPI) => {
  return http<IgetListAPI>('GET', '/tool/gen/list', data)
}

// 删除 gen
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/tool/gen/del/' + ids)
}

// 修改表和字段信息
export const putTableAPI = (data: GenType) => {
  return http<IsuccessTypeAPI>('PUT', '/tool/gen', data)
}

// 代码预览
export const codePreviewAPI = (id: number) => {
  return http<ICodePreviewAPI>('GET', '/tool/gen/preview/' + id)
}

// 生成代码（写到指定文件夹）
export const genCodeAPI = (ids: string | number) => {
  return http<IsuccessTypeAPI>('POST', '/tool/gen/genCode/generatedCode/' + ids)
}
