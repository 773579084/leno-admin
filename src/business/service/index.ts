/**
 * 通用Ser方法
 */
import { ModelStatic, Optional, FindOptions, Includeable } from 'sequelize'

// 获取列表
export const getListSer = async <T extends { pageNum?: number; pageSize?: number }>(
  model: ModelStatic<any>,
  queryParams: T,
  conditions?: {
    otherWhere?: FindOptions
    include?: Includeable[] | Includeable
  }
) => {
  const obj = {}
  const { pageNum = 1, pageSize = 10, ...params } = queryParams

  queryParams.pageNum &&
    Object.assign(obj, {
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize)
    })

  conditions?.include && Object.assign(obj, { include: conditions.include })

  const res = await model.findAndCountAll({
    ...obj,
    where: {
      ...params
    },
    ...conditions?.otherWhere
  })

  const list = {
    count: res.count,
    rows: res.rows || {}
  }
  return list
}

// 单个 新增
export const addSer = async <T extends Optional<any, any>>(model: ModelStatic<any>, data: T) => {
  const res = await model.create(data)

  return res
}

// 批量 新增
export const addAllSer = async <T extends Optional<any, string>[]>(
  model: ModelStatic<any>,
  data: T
) => {
  const res = await model.bulkCreate(data)

  return res
}

// 删除
export const delSer = async (
  model: ModelStatic<any>,
  where: {
    [id: string]: string[]
  }
) => {
  const res = await model.destroy({ where })

  return res
}

// 获取 详情
export const getDetailSer = async <T>(
  model: ModelStatic<any>,
  where: { [id: string]: number }
): Promise<T> => {
  const res = await model.findOne({
    raw: true,
    where
  })
  return res
}

// 修改
export const putSer = async <T>(
  model: ModelStatic<any>,
  where: { [id: string]: string },
  data: T
) => {
  const res = await model.update(data, { where })

  return res[0] > 0
}

// 导出列表(excel)
export const exportExcelSer = async (model: ModelStatic<any>) => {
  const res = await model.findAndCountAll({
    raw: true // 设置为 true，即可返回源数据
  })

  return res.rows
}
