import sequelize from '@/mysql/db/seq.db'
import { QueryTypes } from 'sequelize'

// tool 获取数据表的所有字段及其详细配置信息
// 将sql表的数据及字段名写入到gen和gen_column
export const conversionTables = async (tables: string[]) => {
  // 1、数据库表 数据转换
  const tableDetails = await sequelize.query(
    `select * from information_schema.TABLES where table_schema = '${sequelize.config.database}'`
  )
  console.log(25, tableDetails[0])
  // 1-2、将表数据写入到 代码生成表

  // 2、字段 数据转换
  const columnsObj = {}
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
    columnsObj[tableName] = columns
  }
}
