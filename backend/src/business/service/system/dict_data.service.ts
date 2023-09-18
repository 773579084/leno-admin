import SysDictData from '@/mysql/model/system/dict_data.model';

// 获取 字典数据信息
export const getDataTypeSer = async ({ dict_type }) => {
  const res = (await SysDictData.findAll({
    raw: true,
    where: { dict_type },
    order: [['dict_sort', 'ASC']],
  })) as any;
  return res || null;
};
