import SysDictType from '@/mysql/model/system/dict_type.model';

// 获取列表
export const getOptionselectSer = async () => {
  const res = await SysDictType.findAll({ raw: true });

  return res;
};
