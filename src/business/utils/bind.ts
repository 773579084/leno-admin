import { queryConditionsData } from '../service';

/**
 * 检查 id下是否存在绑定关系
 * @param model
 * @param where
 * @returns any[]
 */
export const bindCheck = async (model: any, where: { [key: string]: string[] }): Promise<any[]> => {
  const res = await queryConditionsData(model, where);
  return res;
};
