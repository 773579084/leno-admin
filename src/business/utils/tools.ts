import sequelize from '@/mysql/db/seq.db'
import ToolGen from '@/mysql/model/tool/gen.model'
import ToolGenColumn from '@/mysql/model/tool/gen_column.model'
import { sqlTableCoulmnsType } from '@/types/tools/gen'
import { QueryTypes } from 'sequelize'
import { addAllSer } from '../service'
import { queryGenIdSer } from '../service/tool/gen.service'

// 下划线转首字母和下划线后首字母大写，并去掉下划线
function underlineToCamel(str: string) {
  return str
    .replace(/_(\w)/g, function (match, p1) {
      return p1.toUpperCase()
    })
    .replace(/^\w/, function (match) {
      return match.toUpperCase()
    })
}

// 下划线后首字母大写，并去掉下划线
function underline(str: string) {
  return str.replace(/_(\w)/g, function (match, p1) {
    return p1.toUpperCase()
  })
}

// sql字段类型与typescript字段类型对比
const sqlTsContrast = {
  bigint: 'Number',
  int: 'Number',
  double: 'Number',
  float: 'Number',
  char: 'String',
  varchar: 'String',
  text: 'String',
  datetime: 'Date',
  bool: 'Boolean',
  boolean: 'Boolean',
  time: 'String'
}

// tool 获取数据表的所有字段及其详细配置信息
// 将sql表的数据及字段名写入到gen和gen_column
export const conversionTables = async (tables: string[]) => {
  // 1、数据库表 数据转换
  const tableDetails = (await sequelize.query(
    `select TABLE_NAME, TABLE_COMMENT from information_schema.TABLES where table_schema = '${sequelize.config.database}'`
  )) as { TABLE_NAME: string; TABLE_COMMENT: string }[][]

  // 1-2、将表数据 处理
  const addTables = []
  tableDetails[0].forEach((table) => {
    const obj = {}
    obj['table_name'] = table.TABLE_NAME
    obj['table_comment'] = table.TABLE_COMMENT
    obj['class_name'] = underlineToCamel(table.TABLE_NAME)
    obj['function_author'] = 'wen'
    addTables.push(obj)
  })
  // 1-3、写入到 代码生成表
  await addAllSer(ToolGen, addTables)

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

  // 2-2、将表字段数据 处理
  const columns = []
  for (let key in columnsObj) {
    // 2-2-1、查询字段的表id为多少
    const tableId = await queryGenIdSer(key)

    columnsObj[key].forEach((item: sqlTableCoulmnsType) => {
      columns.push({
        table_id: tableId,
        column_name: item.name,
        column_comment: item.comment,
        column_type: item.type,
        ts_type: sqlTsContrast[item.type],
        ts_field: underline(item.name)
      })
    })
  }
  // 2-3、写入到 代码生成表
  await addAllSer(ToolGenColumn, columns)
}
