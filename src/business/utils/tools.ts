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
  bigint: 'number',
  int: 'number',
  double: 'number',
  float: 'number',
  char: 'string',
  varchar: 'string',
  text: 'string',
  datetime: 'date',
  bool: 'boolean',
  boolean: 'boolean',
  time: 'string'
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
       column_key AS primaryKey,
       extra AS autoIncrement
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
        ts_field: underline(item.name),
        is_pk: item.primaryKey === 'PRI' ? '0' : '1',
        is_increment: item.autoIncrement === 'auto_increment' ? '0' : '1'
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
    if (item.isPk === '0') {
      modelObj += `${item.columnName}: {
        type: DataTypes.${
          sqlSequelize[item.columnType] ? sqlSequelize[item.columnType] : item.columnType
        },
        allowNull: false,
        unique: true,
        autoIncrement: ${item.isIncrement === '0' ? 'true' : 'false'},
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
 * dict excel字典映射字段生成
 * @param data 表字段数据
 * @returns obj
 */
const excelDictConversion = (data: ColumnType[]) => {
  const dictObj = {}
  data.forEach((item) => {
    if (item.dictType) {
      dictObj[item.columnName] = item.dictType
    }
  })

  return JSON.stringify(dictObj)
}

/**
 * excel字典header映射字段生成
 * @param data 表字段数据
 * @returns []
 */
const excelHeaderCreate = (data: ColumnType[]) => {
  const headers = []
  data.forEach((item) => {
    if (item.isList === '0') {
      const obj = {
        title: item.columnComment,
        dataIndex: item.columnName
      }
      item.isPk === '0' ? Object.assign(obj, { width: 80 }) : null
      headers.push(obj)
    }
  })
  return JSON.stringify(headers)
}

/**
 * 列表搜索条件生成
 * @param data 表字段数据
 * @returns string
 */
const listSearch = (data: ColumnType[]) => {
  let search = ''
  data.forEach((item) => {
    if (item.isQuery === '0' && item.queryType !== 'between') {
      search += `params.${item.tsField} ? (newParams.${item.columnName} = { [Op.${
        item.queryType
      }]: params.${item.tsField} ${item.queryType === 'like' ? '+ %' : ''} }) : null\n\0\0\0\0`
    }
    if (item.queryType === 'between') {
      search += `params.${item.tsField} ? newParams.${item.columnName} = {[Op.between]: [params.${item.tsField}.beginTime, params.${item.tsField}.endTime]} : null\n\0\0\0\0`
    }
  })
  return search
}

/**
 * schema 新增 编辑
 * @param data 表字段数据
 * @param isAdd 是否为新增
 * @returns string
 */
const addEditSchema = (data: ColumnType[], isAdd: boolean) => {
  let schema = ''

  data.forEach((item) => {
    if (isAdd && item.isInsert === '0') {
      schema += `${item.tsField}: Joi.${item.tsType}()${
        item.isRequired === '0' ? '.required()' : ''
      }\n\0\0`
    }
    if (!isAdd && item.isEdit === '0') {
      schema += `${item.tsField}: Joi.${item.tsType}()${
        item.isRequired === '0' ? '.required()' : ''
      }\n\0\0`
    }
  })

  return schema
}

/**
 * typescript 接口类型生成
 * @param data 表字段数据
 * @param type 生成type的种类判断
 * @returns string
 */
const typeCreate = (data: ColumnType[], type: string) => {
  let typeString = ''

  data.forEach((item) => {
    if (type === 'Query' && item.isQuery === '0') {
      switch (item.queryType) {
        case 'between':
          typeString += `${item.tsField}?: {
      beginTime: ${item.tsType}
      endTime: ${item.tsType}
    }\n\0\0\0\0`
          break

        default:
          typeString += `${item.tsField}?: ${item.tsType}\n\0\0\0\0`
          break
      }
    }
    if (type === 'QuerySer' && item.isQuery === '0') {
      typeString += `${item.columnName}?: { [OpTypes.${item.tsType}]: string }\n\0\0\0\0`
    }
    if ((type === 'List' && item.isInsert === '0') || (type === 'List' && item.isEdit === '0')) {
      typeString += `${item.tsField}?: ${item.tsType}\n\0\0\0\0`
    }
    if (
      (type === 'ListSer' && item.isInsert === '0') ||
      (type === 'ListSer' && item.isEdit === '0')
    ) {
      typeString += `${item.columnName}?: ${item.tsType}\n\0\0\0\0`
    }
  })

  return typeString
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
  codes[`${data.businessName}.model.ts`] = `
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
  codes[`${data.businessName}.router.ts`] = `import Router from 'koa-router'
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
  exportExcelMid(exportExcelSer, ${data.className}, ${excelDictConversion(data.columns)}),
  exportMid,
  IndexCon()
)

module.exports = router`

  // 第三步 生成 middleware 业务层
  codes[`${data.businessName}.middleware.ts`] = `import { Context } from 'koa'
import { getDataTypeSer } from '@/business/service/${data.moduleName}/${data.businessName}.service'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType} from '@/types'
import { userType, I${data.className}QueryType, I${data.className}QuerySerType, I${
    data.className
  }, I${data.className}Ser } from '@/types/${data.moduleName}/${data.businessName}.d.ts'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import {  excelBaseStyle } from '@/business/public/excelMap'
import ${data.className} from '@/mysql/model/${data.moduleName}/${data.businessName}.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as I${data.className}QueryType
    let newParams = { pageNum, pageSize } as I${data.className}QuerySerType

    ${listSearch(data.columns)}

    const res = await getListSer<I${data.className}QuerySerType>(${data.className}, newParams)

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询字典类型列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as I${data.className}
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')

    await addSer<I${data.className}Ser>(${data.className}, newAddContent)
    await next()
  } catch (error) {
    console.error('新增用户失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(${data.className}, { ${data.columns[0].columnName}: ctx.state.ids })
  } catch (error) {
    console.error('删除用户失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<I${data.className}Ser>(${data.className}, { ${
    data.columns[0].columnName
  }: ctx.state.ids })

    ctx.state.formatData = res
  } catch (error) {
    console.error('用户个人信息查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 修改
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as I${data.className}
    const lineData = await formatHumpLineTransfer(res, 'line')
    const { ${data.columns[0].columnName}, ...data } = lineData

    await putSer<I${data.className}Ser>(${data.className}, { ${
    data.columns[0].columnName
  } }, { ...data, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '${data.tableComment}',
      style: excelBaseStyle,
      headerColumns: ${excelHeaderCreate(data.columns)},
      tableData: list
    })
    ctx.state.buffer = buffer
    await next()
  } catch (error) {
    console.error('导出失败', error)
    return ctx.app.emit('error', exportExcelErr, ctx)
  }
}`

  // 第四步 生成 schema 新增编辑字段检测
  codes[`${data.businessName}.schema.ts`] = `import Joi from 'joi'

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  ${addEditSchema(data.columns, true)}})

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  ${addEditSchema(data.columns, false)}})`

  // 第五步 生成 typescript 接口类型文件
  codes[`${data.businessName}.d.ts`] = `export interface I${data.className}QueryType {
    pageNum: number
    pageSize: number
    ${typeCreate(data.columns, 'Query')}}

  export interface I${data.className}QuerySerType {
    pageNum: number
    pageSize: number
    ${typeCreate(data.columns, 'QuerySer')}}

  export interface I${data.className} {
    ${typeCreate(data.columns, 'List')}}

  export interface I${data.className}Ser {
    ${typeCreate(data.columns, 'ListSer')}}`

  return codes
}
