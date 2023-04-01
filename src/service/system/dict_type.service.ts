/**
 * 字典类型
 */
import DictType from '@/model/system/dict_type.model'
import { dictTypeQuerySerType, IdictType } from '@/types'
import { Op } from 'sequelize'

class DictTypeService {
  // 获取列表
  async getListSer(queryParams: dictTypeQuerySerType) {
    const { pageNum = 1, pageSize = 10, beginTime, endTime, ...params } = queryParams
    if (beginTime)
      params.created_at = {
        [Op.between]: [beginTime, endTime]
      }

    const res = await DictType.findAndCountAll({
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize),
      where: {
        ...params
      }
    })

    const list = {
      count: (await res).count,
      rows: (await res).rows || {}
    }
    return list
  }

  // 删除
  async delSer(ids) {
    const res = await DictType.destroy({ where: { dict_id: ids } })

    return res || null
  }

  // 新增
  async addUserSer(user) {
    const res = (await DictType.create(user)) as any
    return res || {}
  }

  // 获取 详细信息
  async getDetailSer({ dict_id }) {
    const res = (await DictType.findOne({
      where: { dict_id }
    })) as any
    return res ? res.dataValues : null
  }

  async putSer(list: IdictType) {
    const { dictName, dictId, dictType, ...data } = list
    const res = await DictType.update(
      {
        dict_name: dictName,
        dict_id: dictId,
        dict_type: dictType,
        ...data
      },
      { where: { dict_id: dictId } }
    )

    return res[0] > 0
  }

  // 导出列表(excel)
  async exportExcelSer() {
    const res = await DictType.findAndCountAll({
      raw: true // 设置为 true，即可返回源数据
    })

    return (await res).rows || {}
  }
}

export const { getListSer, delSer, addUserSer, putSer, getDetailSer, exportExcelSer } =
  new DictTypeService()
