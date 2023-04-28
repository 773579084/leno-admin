import Joi from 'joi'
import { remark, requireString, mustId } from '../config.schema'

const addEdit = {
  tableName: requireString,
  className: requireString,
  tableComment: remark
}
// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object(addEdit)

export const putJudg = Joi.object({
  dictId: mustId,
  ...addEdit
})
