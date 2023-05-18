import sequelize from '@/mysql/db/seq.db'
import ToolGen from '@/mysql/model/tool/gen.model'
import ToolGenColumn from '@/mysql/model/tool/gen_column.model'
import { ColumnType, GenType, sqlTableCoulmnsType } from '@/types/tools/gen'
import { DataTypes, QueryTypes } from 'sequelize'
import { addAllSer } from '../service'
import { queryGenIdSer } from '../service/tool/gen.service'
import fs from 'fs'
import path from 'path'

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
        column_type: item.type.toUpperCase(),
        column_default_value: item.defaultValue,
        ts_type: sqlTsContrast[item.type],
        ts_field: underline(item.name)
      })
    })
  }
  // 2-3、写入到 代码生成表
  await addAllSer(ToolGenColumn, columns)
}

/**
 * model 模型字段生成
 * @param data 表字段数据
 * @returns obj
 */
const generateModel = (data: ColumnType[]) => {
  let modelObj = ''

  const sqlSequelize = {
    TINYINT: 'INTEGER',
    SMALLINT: 'INTEGER',
    MEDIUMINT: 'INTEGER',
    INT: 'INTEGER',
    DATETIME: 'DATE',
    TIMESTAMP: 'DATETIME',
    VARCHAR: `STRING`
  }

  data.forEach((item, index) => {
    // 第一个为主id
    if (!index) {
      modelObj += `${item.columnName}: {
        type: DataTypes.${
          sqlSequelize[item.columnType] ? sqlSequelize[item.columnType] : item.columnType
        },
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
        comment: ${item.columnComment}
      },\n`
    } else {
      modelObj += `    ${item.columnName}: {
        type: DataTypes.${
          sqlSequelize[item.columnType] ? sqlSequelize[item.columnType] : item.columnType
        },
        defaultValue: ${item.columnDefaultValue},
        comment: ${item.columnComment}
      },\n`
    }
  })

  return modelObj
}

/**
 * 代码生成
 * @param data 表数据及表字段数据
 * @param isZip 是否打包为压缩包 传任意为true的值压缩
 * @returns
 */
export const generateCode = (data: GenType, isZip?: boolean) => {
  const codes = {}

  // 第一步 生成model模型
  codes[`${data.tableName}.model.ts`] = `
import { DataTypes } from 'sequelize'
import seq from '@/mysql/db/seq.db'

// 创建数据库模型 ${data.tableComment}
const ${data.className} = seq.define(
  '${data.tableName}',
  {
    ${generateModel(data.columns)}
  },
  {
    tableName: '${data.tableName}', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '${data.tableComment}'
  }
)

export default ${data.className}`

  // 第二步 生成路由
  codes[`${data.tableName}.router.ts`] = `import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import { exportExcelSer } from '@/business/service'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getAddMid,
  getDetailMid,
  putMid,
  delMid,
  exportMid
} from '@/business/middleware/${data.moduleName}/${data.businessName}.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import ${data.className} from '@/mysql/model/${data.moduleName}/${data.businessName}.model'
import { addJudg, putJudg } from '@/business/schema/${data.moduleName}/${data.businessName}.schema'

const router = new Router({ prefix: '/${data.moduleName}' })
// 查询列表
router.get('/${data.businessName}/list', getListMid, formatHandle, IndexCon())

// 新增
router.post(
  '/${data.businessName}',
  addEditSchema(addJudg),
  getAddMid,
  IndexCon()
)

// 删除
router.delete('/${data.businessName}/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/${data.businessName}/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put(
  '/${data.businessName}',
  addEditSchema(putJudg),
  putMid,
  IndexCon()
)

// 导出列表(excel)
router.post(
  '/${data.businessName}/export',
  exportExcelMid(exportExcelSer, ${data.className}, { status: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router`

  return codes
}
