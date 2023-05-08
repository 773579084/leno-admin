import sequelize from '@/mysql/db/seq.db'
import { QueryTypes } from 'sequelize'
// tool 获取数据表的所有字段及其详细配置信息
// 将sql表的数据及字段名写入到gen和gen_column
export const conversionTables = async (tables: string[]) => {
  for (const tableName of tables) {
    const query = `
     SELECT
       column_name AS name,
       data_type AS type,
       is_nullable AS allowNull,
       column_default AS defaultValue,
       column_comment AS comment,
       column_key AS primaryKey
     FROM
       information_schema.columns
     WHERE
       table_schema = '${sequelize.config.database}'
       AND table_name = '${tableName}'
   `
    const columns = await sequelize.query(query, { type: QueryTypes.SELECT })
    // console.log(columns)
  }
}
