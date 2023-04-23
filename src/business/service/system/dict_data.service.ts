/**
 * 字典类型
 */
import DictData from '@/mysql/model/system/dict_data.model'
import { dictDataQuerySerType, IdictDataSer } from '@/types/system/system_dict_data'

// 获取列表
export const getListSer = async (queryParams: dictDataQuerySerType) => {
  const { pageNum = 1, pageSize = 10, ...params } = queryParams

  const res = await DictData.findAndCountAll({
    offset: (Number(pageNum) - 1) * Number(pageSize),
    limit: Number(pageSize),
    where: {
      ...params
    },
    order: [['dict_sort', 'ASC']]
  })

  const list = {
    count: res.count,
    rows: res.rows || {}
  }
  return list
}

// 删除
export const delSer = async (ids) => {
  const res = await DictData.destroy({ where: { dict_code: ids } })

  return res || null
}

// 新增
export const addSer = async (user) => {
  const res = (await DictData.create(user)) as any
  return res || {}
}

// 获取 详细信息
export const getDetailSer = async ({ dict_code }) => {
  const res = (await DictData.findOne({
    raw: true,
    where: { dict_code }
  })) as any
  return res ? res : null
}

// 获取 详细信息
export const getDataTypeSer = async ({ dict_type }) => {
  const res = (await DictData.findAll({
    raw: true,
    where: { dict_type }
  })) as any
  return res ? res : null
}

export const putSer = async (list: IdictDataSer) => {
  const { dict_code, ...data } = list

  const res = await DictData.update(
    {
      ...data
    },
    { where: { dict_code } }
  )

  return res[0] > 0
}

// 导出列表(excel)
export const exportExcelSer = async () => {
  const res = await DictData.findAndCountAll({
    raw: true // 设置为 true，即可返回源数据
  })

  return res.rows || {}
}
