/**
 * 字典类型
 */
import DictType from '@/mysql/model/system/dict_type.model'

// 获取列表
export const getOptionselectSer = async () => {
  const res = await DictType.findAll({
    raw: true
  })

  return res
}
