import Joi from 'joi'
import { remark, dictString, mustId, requireString } from '../common.schema'

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  path: requireString,
  component: dictString,
  query: dictString,
  visible: requireString,
  perms: dictString,
  icon: dictString,
  menuName: requireString,
  parentId: mustId,
  orderNum: mustId,
  isFrame: requireString,
  isCache: requireString,
  menuType: requireString,
  status: dictString,
  remark
})

// 验证新增信息 nick 必传字符串
export const putJudg = Joi.object({
  path: requireString,
  component: dictString,
  query: dictString,
  visible: requireString,
  perms: dictString,
  icon: dictString,
  menuId: mustId,
  menuName: requireString,
  parentId: mustId,
  orderNum: mustId,
  isFrame: requireString,
  isCache: requireString,
  menuType: requireString,
  status: dictString,
  remark
})
