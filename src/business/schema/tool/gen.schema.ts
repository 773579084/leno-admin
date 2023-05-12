import Joi from 'joi'
import { remark, requireString, mustId, arrayNoNull } from '../config.schema'

const addEdit = {
  tableName: requireString,
  tableComment: remark,
  className: requireString,
  functionAuthor: requireString,
  tplCategory: requireString,
  packageName: requireString,
  moduleName: requireString,
  businessName: requireString,
  functionName: requireString,
  columns: arrayNoNull
}
// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object(addEdit)

export const putJudg = Joi.object({
  dictId: mustId,
  ...addEdit
})
