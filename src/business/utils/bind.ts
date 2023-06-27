import { ModelStatic } from 'sequelize/types/model'
import { queryConditionsData } from '../service'

/**
 * 检查 id下是否存在绑定关系
 * @param model
 * @param where
 * @returns any[]
 */
export const bindCheck = async (
  model: ModelStatic<any>,
  where: { [key: string]: string[] }
): Promise<any[]> => {
  return await queryConditionsData(model, where)
}
