import Joi from 'joi';
import { remark, dictString, mustId, requireString } from '../config.schema';

const addEdit = {
  path: Joi.string().max(500).allow(''),
  component: dictString,
  query: dictString,
  visible: requireString,
  perms: dictString,
  icon: dictString,
  menuName: requireString,
  parentId: mustId,
  orderNum: mustId,
  isFrame: mustId,
  isCache: mustId,
  menuType: requireString,
  status: dictString,
  remark,
};

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object(addEdit);

// 验证新增信息 nick 必传字符串
export const putJudg = Joi.object({
  menuId: mustId,
  ...addEdit,
});
