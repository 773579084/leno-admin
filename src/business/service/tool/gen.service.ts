import ToolGen from '@/mysql/model/tool/gen.model';

// 查询字段 的表id
export const queryGenIdSer = async (name: string) => {
  const res = (await ToolGen.findAll({
    attributes: ['table_id'],
    where: { table_name: name },
    raw: true,
  })) as unknown as { table_id: number }[];

  return res[0].table_id;
};
