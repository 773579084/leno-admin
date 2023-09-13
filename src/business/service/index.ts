/**
 * 通用Ser方法
 */
import { ModelStatic, Optional, FindOptions, Includeable } from 'sequelize';

/**
 * 获取列表
 * @param model 更改的数据库model
 * @param queryParams where里的过滤条件
 * @param conditions 其他配置项：比如：跨表等
 * @returns
 */
export const getListSer = async <T extends { pageNum?: number; pageSize?: number }>(
  model: ModelStatic<any>,
  queryParams: T,
  conditions?: {
    otherWhere?: FindOptions;
    include?: Includeable[] | Includeable;
  },
) => {
  const obj = {};
  const { pageNum = 1, pageSize = 10, ...params } = queryParams;

  if (queryParams.pageNum)
    Object.assign(obj, {
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize),
    });
  if (conditions?.include) Object.assign(obj, { include: conditions.include });

  const res = await model.findAndCountAll({
    distinct: true, // 去重查询结果集（防止子表的条数被重复计算）
    ...obj,
    where: { ...params },
    order: [['created_at', 'DESC']],
    ...conditions?.otherWhere,
  });

  const list = {
    count: res.count,
    rows: res.rows || {},
  };

  return list;
};

/**
 * 单个 新增
 * @param model 更改的数据库model
 * @param data {}
 * @returns
 */
export const addSer = async <T extends Optional<any, any>>(model: ModelStatic<any>, data: T) => {
  const res = await model.create(data);

  return res.dataValues;
};

/**
 * 批量 新增
 * @param model 更改的数据库model
 * @param data [{}] 数组对象格式
 * @returns
 */
export const addAllSer = async <T extends Optional<any, string>[]>(model: ModelStatic<any>, data: T) => {
  const res = await model.bulkCreate(data);

  return res;
};

/**
 * 删除
 * @param model 更改的数据库model
 * @param where 过滤条件
 * @returns
 */
export const delSer = async (
  model: ModelStatic<any>,
  where: {
    [id: string]: any;
  },
) => {
  await model.destroy({ where });
};

/**
 * 获取 详情
 * @param model 数据库model
 * @param where 过滤条件
 * @param conditions 其他配置项：比如：跨表等
 * @returns Object
 */
export const getDetailSer = async <T>(
  model: ModelStatic<any>,
  where: { [id: string]: number },
  conditions?: {
    otherWhere?: FindOptions;
    include?: Includeable[] | Includeable;
  },
): Promise<T> => {
  const res = await model.findOne({
    where,
    ...conditions,
  });
  return res.dataValues;
};

/**
 * 修改
 * @param model 更改的数据库model
 * @param where 过滤条件
 * @param data 数据
 * @returns
 */
export const putSer = async <T>(model: ModelStatic<any>, where: { [id: string]: number | number[] | string | string[] }, data: T) => {
  const res = await model.update(data, { where });

  return res;
};

/**
 * 导出列表(excel)
 * @param model 更改的数据库model
 * @returns
 */
export const exportExcelSer = async (model: ModelStatic<any>) => {
  // 设置为 true，即可返回源数据
  const res = await model.findAndCountAll({ raw: true });

  return res.rows;
};

/**
 * 查询相关条件所有数据
 * @param model
 * @param where
 */
export const queryConditionsData = async (model: ModelStatic<any>, where: { [key: string]: any }, otherWhere?: any) => {
  const res = await model.findAll({
    raw: true, // 设置为 true，即可返回源数据
    ...otherWhere,
    where,
  });

  return res;
};
