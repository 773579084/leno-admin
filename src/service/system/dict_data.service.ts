/**
 * 字典类型
 */
import DictData from '@/model/system/dict_data.model'
import { dictDataQuerySerType, IdictDataSer } from '@/types/system/system_dict_data'

class DictTypeService {
  // 获取列表
  async getListSer(queryParams: dictDataQuerySerType) {
    const { pageNum = 1, pageSize = 10, ...params } = queryParams

    const res = await DictData.findAndCountAll({
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
    const res = await DictData.destroy({ where: { dict_code: ids } })

    return res || null
  }

  // 新增
  async addSer(user) {
    const res = (await DictData.create(user)) as any
    return res || {}
  }

  // 获取 详细信息
  async getDetailSer({ dict_code }) {
    const res = (await DictData.findOne({
      raw: true,
      where: { dict_code }
    })) as any
    return res ? res : null
  }

  // 获取 详细信息
  async getDataTypeSer({ dict_type }) {
    const res = (await DictData.findAll({
      raw: true,
      where: { dict_type }
    })) as any
    return res ? res : null
  }

  async putSer(list: IdictDataSer) {
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
  async exportExcelSer() {
    const res = await DictData.findAndCountAll({
      raw: true // 设置为 true，即可返回源数据
    })

    return (await res).rows || {}
  }
}

export const { getListSer, delSer, addSer, putSer, getDetailSer, exportExcelSer, getDataTypeSer } =
  new DictTypeService()
