import Joi from 'joi'
import { remark, requireString, dictString, mustId } from '../common.schema'

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  dictName: requireString,
  dictType: requireString,
  status: dictString,
  remark
})

// 验证新增信息 nick 必传字符串
export const putJudg = Joi.object({
  dictId: mustId,
  dictName: requireString,
  dictType: requireString,
  status: dictString,
  remark
})
