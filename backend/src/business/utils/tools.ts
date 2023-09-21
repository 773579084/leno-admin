import { QueryTypes } from 'sequelize';
import sequelize from '@/mysql/db/seq.db';
import ToolGen from '@/mysql/model/tool/gen.model';
import ToolGenColumn from '@/mysql/model/tool/gen_column.model';
import { ColumnType, GenType, sqlTableCoulmnsType } from '@/types/tools/gen';
import { addAllSer } from '../service';
import { queryGenIdSer } from '../service/tool/gen.service';
import { underlineToCamel, underline } from './index';

// sql字段类型与typescript字段类型对比
const sqlTsContrast = {
  bigint: 'number',
  int: 'number',
  double: 'number',
  float: 'number',
  char: 'string',
  varchar: 'string',
  text: 'string',
  datetime: 'string',
  bool: 'boolean',
  boolean: 'boolean',
  time: 'string',
};

// tool 获取数据表的所有字段及其详细配置信息
// 将sql表的数据及字段名写入到gen和gen_column
export const conversionTables = async (tables: string[]) => {
  // 1、数据库表 数据转换
  const tableDetails = (await sequelize.query(`select TABLE_NAME, TABLE_COMMENT from information_schema.TABLES where table_schema = '${sequelize.config.database}'`)) as {
    TABLE_NAME: string;
    TABLE_COMMENT: string;
  }[][];

  // 1-2、将表数据 处理
  const addTables = [];
  tableDetails[0].forEach((table) => {
    // 1-2-1 找出新增表
    if (tables.includes(table.TABLE_NAME)) {
      const obj = { table_name: '', table_comment: '', class_name: '', function_author: '' };
      obj.table_name = table.TABLE_NAME;
      obj.table_comment = table.TABLE_COMMENT;
      obj.class_name = underlineToCamel(table.TABLE_NAME);
      obj.function_author = 'wen';
      addTables.push(obj);
    }
  });

  // 1-3、写入到 代码生成表
  await addAllSer(ToolGen, addTables);

  // 2、字段 数据转换
  const columnsObj = {};
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
   `;
    // eslint-disable-next-line no-await-in-loop
    const columns = await sequelize.query(query, { type: QueryTypes.SELECT });
    columnsObj[tableName] = columns;
  }

  // 2-2、将表字段数据 处理
  const columns = [];
  for (const key in columnsObj) {
    // 2-2-1、查询字段的表id为多少
    if (Object.hasOwn(columnsObj, key)) {
      // eslint-disable-next-line no-await-in-loop
      const tableId = await queryGenIdSer(key);

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
          is_increment: item.autoIncrement === 'auto_increment' ? '0' : '1',
        });
      });
    }
  }
  // 2-3、写入到 代码生成表
  await addAllSer(ToolGenColumn, columns);
};

/**
 * 获取列表条件
 * @param data
 */
const listSearch = (data: ColumnType[]) => {
  let search = '';
  data.forEach((item) => {
    if (item.isQuery === '0' && item.queryType !== 'between') {
      search += `if(params.${item.tsField}) newParams.${item.columnName} = { [Op.${item.queryType}]: params.${item.tsField} ${item.queryType === 'like' ? '+ "%"' : ''} }\n    `;
    }
    if (item.queryType === 'between') {
      // eslint-disable-next-line max-len
      search += ` if (params.${item.tsField}) params.${item.tsField} = JSON.parse(params.${item.tsField} as unknown as string)\n    if(params.${item.tsField}) newParams.${item.columnName} = {[Op.between]: [params.${item.tsField}.beginTime, params.${item.tsField}.endTime]}\n    `;
    }
  });
  return search;
};

/**
 * model 模型字段生成
 * @param data 表字段数据
 * @returns obj
 */
const generateModel = (data: ColumnType[]) => {
  let modelObj = '';

  const sqlSequelize = {
    TINYINT: 'INTEGER',
    SMALLINT: 'INTEGER',
    MEDIUMINT: 'INTEGER',
    INT: 'INTEGER',
    DATETIME: 'DATE',
    TIMESTAMP: 'DATETIME',
    VARCHAR: 'STRING',
  };

  data.forEach((item) => {
    // 第一个为主id
    if (item.isPk === '0') {
      modelObj += `${item.columnName}: {
        type: DataTypes.${sqlSequelize[item.columnType] ? sqlSequelize[item.columnType] : item.columnType},
        allowNull: false,
        unique: true,
        autoIncrement: ${item.isIncrement === '0' ? 'true' : 'false'},
        primaryKey: true,
        comment: "${item.columnComment}"
      },\n`;
    } else {
      modelObj += `    ${item.columnName}: {
        type: DataTypes.${sqlSequelize[item.columnType] ? sqlSequelize[item.columnType] : item.columnType},
        defaultValue:${item.columnDefaultValue},
        comment: "${item.columnComment}"
      },\n`;
    }
  });

  return modelObj;
};

/**
 * dict excel字典映射字段生成
 * @param data 表字段数据
 * @returns obj
 */
const excelDictConversion = (data: ColumnType[]) => {
  const dictObj = {};
  data.forEach((item) => {
    if (item.dictType) {
      dictObj[item.columnName] = item.dictType;
    }
  });

  return JSON.stringify(dictObj);
};

/**
 * excel字典header映射字段生成
 * @param data 表字段数据
 * @returns []
 */
const excelHeaderCreate = (data: ColumnType[]) => {
  const headers = [];
  data.forEach((item) => {
    if (item.isList === '0') {
      const obj = {
        title: item.columnComment,
        dataIndex: item.columnName,
      };
      if (item.isPk === '0') {
        Object.assign(obj, { width: 80 });
      }
      headers.push(obj);
    }
  });
  return JSON.stringify(headers);
};

/**
 * schema 新增 编辑
 * @param data 表字段数据
 * @param isAdd 是否为新增
 * @returns string
 */
const addEditSchema = (data: ColumnType[], isAdd: boolean) => {
  let schema = '';

  data.forEach((item) => {
    if (isAdd && item.isInsert === '0') {
      schema += `${item.tsField}: Joi.${item.tsType}()${item.isRequired === '0' ? '.required(),' : ".allow(''),"}\n  `;
    }
    if (!isAdd && item.isEdit === '0') {
      schema += `${item.tsField}: Joi.${item.tsField === 'remark' ? 'any' : item.tsType}()${item.isRequired === '0' ? '.required(),' : ".allow(''),"}\n  `;
    }
  });

  return schema;
};

/**
 * typescript 接口类型生成
 * @param data 表字段数据
 * @param type 生成type的种类判断
 * @returns string
 */
const typeCreate = (data: ColumnType[], type: string) => {
  let typeString = '';

  data.forEach((item) => {
    // 当等于 Query 时默认渲染表所有的type类型
    if (type === 'Query') {
      switch (item.queryType) {
        case 'between':
          typeString += `  ${item.tsField}?: {
      beginTime: ${item.tsType}
      endTime: ${item.tsType}
    }\n   `;
          break;

        default:
          typeString += `  ${item.tsField}?: ${item.tsType}\n`;
          break;
      }
    }
    if (type === 'QuerySer' && item.isQuery === '0') {
      typeString += `  ${item.columnName}?: { [OpTypes.${item.queryType}]: string }\n   `;
    }
    if ((type === 'List' && item.isInsert === '0') || (type === 'List' && item.isEdit === '0')) {
      typeString += `  ${item.tsField}?: ${item.tsType}\n    `;
    }
    if (type === 'ListSer') {
      typeString += `  ${item.columnName}?: ${item.tsType}\n`;
    }
  });

  return typeString;
};

/**
 * 字符串首字母daxie
 * @param string
 * @returns string
 */
const stringFirst = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * 生成请求字典的axios
 * @param data
 * @returns string
 */
const getDicts = (data: ColumnType[]) => {
  let dicts = '';
  const completeDicts = [];
  data.forEach((item) => {
    if (item.dictType && !completeDicts.includes(item.dictType)) {
      dicts += `const ${item.dictType} = await getDictsApi('${item.dictType}')
      setDict${underlineToCamel(item.columnName)}(${item.dictType}.data.result)\n    `;
      completeDicts.push(item.dictType);
    }
  });
  return dicts;
};

/**
 * 生成请求字典的 state
 * @param data
 * @returns string
 */
const getDictsState = (data: ColumnType[]) => {
  let dictState = '';
  const completeDicts = [];
  data.forEach((item) => {
    if (item.dictType && !completeDicts.includes(item.dictType)) {
      dictState += `const [dict${underlineToCamel(item.columnName)}, setDict${underlineToCamel(item.columnName)}] = useState<IdictType[]>([])\n    `;
      completeDicts.push(item.dictType);
    }
  });
  return dictState;
};

/**
 * 生成请求字典的 state
 * @param data
 * @returns string
 */
const createSearch = (data: ColumnType[]) => {
  let searchStr = '';
  data.forEach((item) => {
    if (item.htmlType === 'datetime') {
      searchStr += `let { ${item.tsField}, ...form } = queryForm.getFieldsValue()
      if (${item.tsField}) {
        form = {
          ...form,
          ${item.tsField}:{
            beginTime: dayjs(${item.tsField}[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(${item.tsField}[1]).format('YYYY-MM-DD HH:mm:ss'),
          }
        }
      }`;
    }
  });
  return searchStr || 'let form = queryForm.getFieldsValue()';
};

/**
 * 生成 前端 table 数据结构
 * @param data
 * @returns string
 */
const createTableData = (data: ColumnType[]) => {
  let tableData = '';
  data.forEach((item) => {
    if (item.isList === '0') {
      if (item.htmlType !== 'imageUpload') {
        tableData += `{
          title: '${item.columnComment}',
          dataIndex: '${item.tsField}',
          key: '${item.tsField}',
          align: 'center',
          ${item.dictType ? `render: (value) => <DictTag options={dict${underlineToCamel(item.columnName)}} value={value} />,` : ''}},\n    `;
      }
    }
  });

  return tableData;
};

/**
 * 生成 前端 search html结构
 * @param data
 * @returns string
 */
const createHtmlSearch = (data: ColumnType[]) => {
  let htmlSearch = '';

  data.forEach((item) => {
    if (item.isQuery === '0') {
      switch (item.htmlType) {
        case 'select':
          if (item.dictType) {
            htmlSearch += `<Form.Item name="${item.tsField}" label="${item.columnComment}">
            <Select
              style={{ width: 240 }}
              placeholder="${item.columnComment}"
              allowClear
              options={dict${underlineToCamel(item.columnName)}.map((item) => ({
                value: item.dictValue,
                label: item.dictLabel,
              }))}
            />
          </Form.Item>\n        `;
          }
          break;
        case 'datetime':
          htmlSearch += `<Form.Item label="${item.columnComment}"  name="${item.tsField}">
           <RangePicker style={{ width: 240 }} />
         </Form.Item>\n        `;
          break;

        default:
          htmlSearch += `<Form.Item label="${item.columnComment}" name="${item.tsField}">
          <Input
            style={{ width: 240 }}
            placeholder="请输入${item.columnComment}"
            allowClear
            onPressEnter={searchQueryFn}
          />
         </Form.Item>\n        `;
          break;
      }
    }
  });

  return htmlSearch;
};

/**
 * 生成 前端 新增编辑 html结构
 * @param data
 * @returns string
 */
const createHtmlAddEdit = (data: ColumnType[]) => {
  let addEdit = '';
  data.forEach((item) => {
    if (item.isInsert === '0' || item.isEdit === '0') {
      switch (item.htmlType) {
        case 'input':
          addEdit += `<Form.Item
           label="${item.columnComment}"
           name="${item.tsField}"
           hidden={${item.isEdit === '1'}}
           ${item.isRequired === '0' ? `rules={[{ required: true, message: '请输入${item.columnComment}!' }]}` : ''}>
          <Input placeholder= "请输入${item.columnComment}"/>
        </Form.Item>\n        `;
          break;
        case 'textarea':
          addEdit += `<Form.Item
           label="${item.columnComment}"
           name="${item.tsField}"
           rules={[{ max: 200, message: '请输入内容(200字以内)!' }]}
          >
          <TextArea showCount placeholder="请输入内容(200字以内)"/>
         </Form.Item>\n        `;
          break;
        case 'radio':
          if (item.dictType) {
            addEdit += `<Form.Item label="${item.columnComment}" name="${item.tsField}">
            <Radio.Group
              options={dict${underlineToCamel(item.columnName)}.map((item) => ({
                value: item.dictValue,
                label: item.dictLabel,
              }))}
            />
           </Form.Item>\n        `;
          }
          break;
        case 'select':
          if (item.dictType) {
            addEdit += `<Form.Item label="${item.columnComment}" name="${item.tsField}">
            <Select
             placeholder="${item.columnComment}"
             allowClear
             options={dict${underlineToCamel(item.columnName)}.map((item) => ({
               value: item.dictValue,
               label: item.dictLabel,
             }))}
            />
           </Form.Item>\n        `;
          }
          break;
        case 'checkbox':
          if (item.dictType) {
            addEdit += `<Form.Item label="${item.columnComment}" name="${item.tsField}">
            <Checkbox.Group
              options={dict${underlineToCamel(item.columnName)}.map((item) => ({
                value: item.dictValue,
                label: item.dictLabel,
              }))}
            />
           </Form.Item>\n        `;
          }
          break;
        case 'datetime':
          addEdit += `<Form.Item label="${item.columnComment}"    name="${item.tsField}">
              <RangePicker style={{ width: 240 }} />
            </Form.Item>\n        `;
          break;
        case 'imageUpload':
          addEdit += '<ImageUpload ref={fileRef} />\n        ';
          break;
        case 'fileUpload':
          addEdit += '<FileUpload ref={fileRef} />\n        ';
          break;
        case 'editor':
          addEdit += `<Form.Item label="${item.columnComment}"    name="${item.tsField}">
            <TextEditor ref={editorRef} editorHtml={editorHtml}  imgs={imgs}/>
          </Form.Item>\n        `;
          break;

        default:
          break;
      }
    }
  });

  return addEdit;
};

/**
 * 代码生成
 * @param data 表数据及表字段数据
 * @returns
 */
export const generateCode = (data: GenType) => {
  const codes = {};
  const mainIdKey = data.columns.find((item) => item.isPk === '0').tsField;
  // 第一步 生成model模型
  codes['model.ts'] = `
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

export default ${data.className}`;

  // 第二步 生成路由
  codes['router.ts'] = `import Router from 'koa-router'
// 格式转换
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
${
  data.tplCategory !== 'tree'
    ? `import { exportExcelMid , formatHandle } from '@/business/middleware/common/common.middleware'
import ${data.className} from '@/mysql/model/${data.moduleName}/${data.businessName}.model'
import { exportExcelSer } from '@/business/service'`
    : `import { formatHandle } from '@/business/middleware/common/common.middleware'`
}
import { addJudg, putJudg } from '@/business/schema/${data.moduleName}/${data.businessName}.schema'
import { hasPermi } from '@/business/middleware/common/auth'

const router = new Router({ prefix: '/${data.moduleName}' })
// 查询列表
router.get('/${data.businessName}/list', hasPermi('${data.moduleName}:${data.businessName}:query'), getListMid, formatHandle, IndexCon())

// 新增
router.post(
  '/${data.businessName}',
  hasPermi('${data.moduleName}:${data.businessName}:add'),
  addEditSchema(addJudg),
  getAddMid,
  IndexCon()
)

// 删除
router.delete('/${data.businessName}/:id', hasPermi('${data.moduleName}:${data.businessName}:remove'), judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/${data.businessName}/detail/:id', hasPermi('${data.moduleName}:${data.businessName}:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put(
  '/${data.businessName}',
  hasPermi('${data.moduleName}:${data.businessName}:edit'),
  addEditSchema(putJudg),
  putMid,
  IndexCon()
)

${
  data.tplCategory !== 'tree'
    ? `// 导出列表(excel)
router.post(
  '/${data.businessName}/export',
  hasPermi('${data.moduleName}:${data.businessName}:export'),
  exportExcelMid(exportExcelSer, ${data.className}, ${excelDictConversion(data.columns)}),
  exportMid,
  IndexCon()
)\n`
    : ''
}export default router`;

  // 第三步 生成 middleware 业务层
  codes['middleware.ts'] = `import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType} from '@/types'
import {  I${data.businessName}QueryType, I${data.businessName}QuerySerType, I${data.businessName}, I${data.businessName}Ser } from '@/types/${data.moduleName}/${data.businessName}'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
${
  data.tplCategory !== 'tree'
    ? `import { excelJsExport } from '@/business/utils/excel'
import {  excelBaseStyle } from '@/business/public/excelMap'\n`
    : ''
}import ${data.className} from '@/mysql/model/${data.moduleName}/${data.businessName}.model'
import { Op } from 'sequelize'
const { uploadParamsErr, getListErr, sqlErr, delErr, ${data.tplCategory === 'tree' ? '' : 'exportExcelErr'}} = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as I${data.businessName}QueryType
    let newParams = { pageNum, pageSize } as I${data.businessName}QuerySerType
    ${listSearch(data.columns)}
    const res = await getListSer<I${data.businessName}QuerySerType>(${data.className}, newParams)

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as I${data.businessName}
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as  I${data.businessName}Ser

    await addSer<I${data.businessName}Ser>(${data.className}, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
${
  data.columns.find((item) => item.htmlType === 'editor')
    ? `// 拿取图片信息，有则删除
    const { imgs } = await getDetailSer<InoticeSer>(SysNotice, { notice_id: ctx.state.ids })
    if (imgs) {
      JSON.parse(imgs).forEach((item: string) => removeSpecifyFile(item))
    }`
    : ''
}
    await delSer(${data.className}, { ${data.columns.find((item) => item.isPk === '0').columnName}: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<I${data.businessName}Ser>(${data.className}, { ${data.columns.find((item) => item.isPk === '0').columnName}: ctx.state.ids }: ctx.state.ids })

    ctx.state.formatData = res
  } catch (error) {
    console.error('详细数据查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 修改
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as I${data.businessName}
    const lineData =  formatHumpLineTransfer(res, 'line') as I${data.businessName}Ser
    const { ${data.columns.find((item) => item.isPk === '0').columnName}: ctx.state.ids }, ...data } = lineData

    await putSer<I${data.businessName}Ser>(${data.className}, { ${data.columns.find((item) => item.isPk === '0').columnName}: ctx.state.ids }}, { ...data, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

${
  data.tplCategory === 'tree'
    ? ''
    : `// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData
    const dicts = ctx.state.dicts

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '${data.tableComment}',
      style: excelBaseStyle,
      headerColumns: ${excelHeaderCreate(data.columns)},
      tableData: list,
      dicts: dicts
    })
    ctx.state.buffer = buffer
    await next()
  } catch (error) {
    console.error('导出失败', error)
    return ctx.app.emit('error', exportExcelErr, ctx)
  }
}`
}`;

  // 第四步 生成 schema 新增编辑字段检测
  codes['schema.ts'] = `import Joi from 'joi'

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
${addEditSchema(data.columns, true)}})

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  ${mainIdKey}:Joi.number().required(),
${addEditSchema(data.columns, false)}})`;

  // 第五步 生成 typescript 接口类型文件
  codes['node.d.ts'] = `/* global OpTypes */\n
  // 后端 类型文件
export interface I${data.businessName}QueryType {
  pageNum: number
  pageSize: number
${typeCreate(data.columns, 'Query')}}

export interface I${data.businessName}QuerySerType {
  pageNum: number
  pageSize: number
${typeCreate(data.columns, 'QuerySer')}}

export interface I${data.businessName} {
${typeCreate(data.columns, 'List')}}

export interface I${data.businessName}Ser {
${typeCreate(data.columns, 'ListSer')}}`;

  // 第六步 前端 生成api接口
  codes['api.ts'] = `import { http } from '@/api'
import {
  I${data.businessName}Type,
  I${data.businessName}DetailType
  IsuccessTypeAPI,
  IgetDetailTypeAPI,
  IgetListAPI
} from '@/type/modules/${data.moduleName}/${data.businessName}'

// 查询列表
export const getListAPI = (data: I${data.businessName}Type) => {
  return http<IgetListAPI>('GET', '/${data.moduleName}/${data.businessName}/list', data)
}

// 删除
export function delAPI(ids: string) {
  return http<IsuccessTypeAPI>('DELETE', '/${data.moduleName}/${data.businessName}/' + ids)
}

// 新增
export const addAPI = (data: I${data.businessName}DetailType) => {
  return http<IsuccessTypeAPI>('POST', '/${data.moduleName}/${data.businessName}', data)
}

// 获取详细数据
export const getDetailAPI = (id: number) => {
  return http<IgetDetailTypeAPI>('GET', '/${data.moduleName}/${data.businessName}/detail/' + id)
}

// 修改
export const putAPI = (data: I${data.businessName}DetailType) => {
  return http<IsuccessTypeAPI>('PUT', '/${data.moduleName}/${data.businessName}', data)
}`;

  // 第七步 前端 生成dom结构
  const total = '`共 ${total} 条`';
  const ids = '`是否确认删除编号为"${ids}"的数据项？`';
  codes[data.tplCategory === 'tree' ? 'index-tree.tsx' : 'index.tsx'] = `import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Form,
  Input,
  Select,${data.columns.find((item) => item.htmlType === 'datetime') ? '\nDatePicker,' : ''}${data.columns.find((item) => item.htmlType === 'checkbox') ? '\nCheckbox,' : ''}
  Col,
  Row,
  Tooltip,
  Table,
  Pagination,
  Modal,
  Radio,
  message,
} from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ${data.tplCategory === 'tree' ? 'SwapOutlined,' : 'VerticalAlignBottomOutlined,'}
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getListAPI,
  delAPI,
  getDetailAPI,
  addAPI,
  putAPI,
} from '@/api/modules/${data.moduleName}/${data.businessName}'
import { getDictsApi } from '@/api/modules/system/dictData'
${data.tplCategory === 'tree' ? '' : "import { download } from '@/api'"}
${data.tplCategory === 'tree' ? '' : "import { pageDelJump } from '@/utils'"}
import { I${data.businessName}Type ,I${data.businessName}DetailType ${data.tplCategory === 'tree' ? ',ITreeType' : ''}} from '@/type/modules/${data.moduleName}/${data.businessName}'
${data.columns.find((item) => item.htmlType === 'datetime') ? 'const { RangePicker } = DatePicker\n' : ''}import ColorBtn from '@/components/ColorBtn'
import { hasPermi } from '@/utils/auth'
import { IdictType } from '@/type/modules/system/sysDictData'
${data.columns.find((item) => item.dictType) ? "import DictTag from '@/components/DictTag'" : ''}
${data.tplCategory === 'tree' ? "import { generalTreeFn } from '@/utils/smallUtils'\n" : ''}${data.columns.find((item) => item.htmlType === 'datetime') ? "import dayjs from 'dayjs'\n" : ''}${
    data.columns.find((item) => item.htmlType === 'editor')
      ? `import TextEditor from '@/components/TextEditor'
import { IDomEditor } from '@wangeditor/editor'
import { commonDelImgAPI } from '@/api/modules/common'\n`
      : ''
  }const ${stringFirst(data.className)} = () => {
  ${data.columns.find((item) => item.htmlType === 'textarea') ? 'const { TextArea } = Input\n' : ''}const [queryForm] = Form.useForm()
  const [addEditForm] = Form.useForm()
  const { confirm } = Modal

  // 分页
  const [queryParams, setQueryParams] = useState<I${data.businessName}Type>({ pageNum: 1, pageSize: 10 })
  // 列表数据
  ${data.tplCategory === 'tree' ? 'const [dataList, setDataList] = useState([])' : `const [dataList, setDataList] = useState({ count: 0, rows: [] as I${data.businessName}DetailType[] })`}
  // table loading
  const [loading, setLoading] = useState(true)
  // 新增编辑 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 新增编辑判断
  const [isAdd, setIsAdd] = useState(true)
  ${
    data.tplCategory === 'tree'
      ? ''
      : `// 非单个禁用
  const [single, setSingle] = useState(true)
  // 非多个禁用
  const [multiple, setMultiple] = useState(true)
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([])
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('')`
  }
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true)
  // 当前编辑的id
  const [currentId, setCurrentId] = useState<number>()
  ${data.columns.find((item) => item.htmlType === 'fileUpload') ? 'const fileRef = useRef()' : ''}
  ${
    data.columns.find((item) => item.htmlType === 'editor')
      ? `// editor
      const editorRef = useRef()
      const [editorHtml, setEditorHtml] = useState<string>('')
      const [imgs, setImgs] = useState<string>('')\n`
      : ''
  }${
    data.tplCategory === 'tree'
      ? `  //  行展开
  const [expandKeys, setExpandKeys] = useState<any>({})\n`
      : ''
  }${getDictsState(data.columns)}useEffect(() => {
    try {
      const getDictsFn = async () => {
        ${getDicts(data.columns)}}
      getDictsFn()
    } catch (error) {}
  }, [])

  // 查询列表
  const getList = async () => {
    try {
      const { data } = await getListAPI(queryParams)
      ${
        data.tplCategory === 'tree'
          ? `const treeData = generalTreeFn(data.result.rows, '${underline(data.treeParentCode)}', '${underline(data.treeCode)}') as any
      setDataList(treeData)`
          : 'setDataList({ ...data.result })'
      }
      
      message.success('查询成功')
      setLoading(false)
    } catch (error) {}
  }

  
  useEffect(() => {
    getList()
  }, [queryParams])

  // 搜索
  const searchQueryFn = () => {
    ${createSearch(data.columns)}
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    })
  }

  // 重置
  const resetQueryFn = () => {
    queryForm.resetFields()
    ${data.tplCategory === 'tree' ? '' : 'setSelectKeys([])'}
    setQueryParams({ pageNum: 1, pageSize: 10 })
  }
  ${
    data.columns.find((item) => item.htmlType === 'editor')
      ? `  // 添加编辑 确认
  const addEditFn = async () => {
    const { editor, html, uploadedImg } = editorRef.current as unknown as {
      editor: IDomEditor
      html: string
      uploadedImg: string[]
    }
    // 1 获取富文本保存的 图片
    const saveImgs = editor.getElemsByType('image') as unknown as {
      src: string
    }[]
    // 2 用保存全部图片的 uploadedImg 对比 saveImgs 得出需要删除的img 调用后端接口删除图片
    const delImgs: string[] = []
    uploadedImg.forEach((item) => {
      if (
        !saveImgs.find((value) => value.src.split('/')[value.src.split('/').length - 1] === item)
      ) {
        delImgs.push(item)
      }
    })
    await commonDelImgAPI(delImgs)

    // 3 将 html 存储到 form 表单
    addEditForm.setFieldValue('${data.columns.find((item) => item.htmlType === 'editor').tsField}', html)

    addEditForm.submit()
  }\n`
      : ''
  }
  ${
    data.tplCategory === 'tree'
      ? ''
      : `// row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      if (!selectedRowKeys.length || selectedRowKeys.length > 1) {
        setSingle(true)
      } else {
        setSingle(false)
      }
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true)
      setSelectKeys(selectedRowKeys)
      setRowKeys(selectedRowKeys.join(','))
    },
  }`
  }

  // 获取详情
  const handleEditForm = async (id: number) => {
    try {
      const { data } = await getDetailAPI(id)
      ${
        data.columns.find((item) => item.htmlType === 'editor')
          ? `setEditorHtml(data.result.noticeContent as string)
          setImgs(data.result.${data.columns.find((item) => item.htmlType === 'editor')} as string)\n`
          : ''
      }setCurrentId(id)
      setIsModalOpen(true)
      setIsAdd(false)
      addEditForm.setFieldsValue(data.result as unknown as I${data.businessName}DetailType)
    } catch (error) {}
  }

  // 表单提交
  const handleFormFinish = async (values: I${data.businessName}DetailType) => {
    try {
      if (isAdd) {
        await addAPI({ ...values ${data.columns.find((item) => item.htmlType === 'editor') ? `,${data.columns.find((item) => item.htmlType === 'editor').columnName}:imgs` : ''}})
        message.success('新增成功')
      } else {
        await putAPI({ ...values, ${
          data.columns.find((item) => item.htmlType === 'editor') ? `${data.columns.find((item) => item.htmlType === 'editor').columnName}:imgs,` : ''
        } ${mainIdKey}: currentId })
        message.success('修改成功')
      }
      ${
        data.columns.find((item) => item.htmlType === 'fileUpload')
          ? `      const { handleUploadOk } = fileRef.current as unknown as {
        handleUploadOk: Function
        handleUploadCancel: Function
      }
      handleUploadOk()`
          : ''
      }
    } catch (error) {}
    setIsModalOpen(false)
    addEditForm.resetFields()
    getList()
  }

  // 分页
  ${
    data.tplCategory === 'tree'
      ? ''
      : `const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize })
  }`
  }

  // 删除
  const delFn = (ids: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: ${ids},
      centered: true,
      async onOk() {
        try {
          const { data } = await delAPI(ids)
          message.success(data.message)
          pageDelJump(dataList.count, ids, queryParams, setQueryParams)
        } catch (error) {}
      },
    })
  }

  ${
    data.tplCategory === 'tree'
      ? `  // 行展开
  const expandFn = () => {
    if (expandKeys['expandedRowKeys'] && expandKeys['expandedRowKeys'].length) {
      setExpandKeys({
        expandedRowKeys: [],
      })
    } else {
      setExpandKeys({
        expandedRowKeys: [],
      })
      const ids: number[] = []
      function checkChild(list: ITreeType[]) {
        list.forEach((item) => {
          if (item.children?.length) {
            ids.push(item.${mainIdKey} as number)

            checkChild(item.children)
          }
        })
      }
      checkChild(dataList)
      setExpandKeys({
        expandedRowKeys: ids,
      })
    }
  }\n`
      : ''
  }// table
  let columns = [
    {
      title: '编码',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    ${createTableData(data.columns)}{
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: I${data.businessName}DetailType) => (
        <div>
          <Button
            hidden={hasPermi('${data.moduleName}:${data.businessName}:edit')}
            onClick={() => handleEditForm(record.${mainIdKey} as number)}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button
            hidden={hasPermi('${data.moduleName}:${data.businessName}:remove')}
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(String(record.${mainIdKey}))}
          >
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<I${data.businessName}DetailType>

  // table 数据源
  const tableData = dataList.rows

  return (
  <div className="app-container">
    <Row gutter={16}>
      <Col span={24}>
        <Form
          form={queryForm}
          hidden={!searchShow}
          layout="inline"
          className="leno-search"
        >
          ${createHtmlSearch(data.columns)}
          <Form.Item>
            <Button onClick={searchQueryFn} type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={resetQueryFn} icon={<SyncOutlined />}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <Row gutter={16} className="mb10">
          <Col span={16} className="leno-btn">
            <Row gutter={8}>
              <Col>
                <ColorBtn
                  hidden={hasPermi('${data.moduleName}:${data.businessName}:add')}
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsModalOpen(true)
                    setIsAdd(true)
                  }}
                >
                  新增
                </ColorBtn>
              </Col>
              ${
                data.tplCategory === 'tree'
                  ? `<Col>
              <ColorBtn
                color="info"
                icon={<SwapOutlined rotate={90} />}
                onClick={expandFn}
              >
                展开/折叠
              </ColorBtn>
            </Col>`
                  : `<Col>
                  <ColorBtn
                    hidden={hasPermi('${data.moduleName}:${data.businessName}:edit')}
                    disabled={single}
                    color="success"
                    icon={<EditOutlined />}
                    onClick={() => handleEditForm(Number(rowKeys))}
                  >
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('${data.moduleName}:${data.businessName}:remove')}
                    onClick={() => delFn(rowKeys)}
                    disabled={multiple}
                    color="danger"
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('${data.moduleName}:${data.businessName}:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => download('/${data.moduleName}/${data.businessName}/export')}
                  >
                    导出
                  </ColorBtn>
                </Col>`
              }
            </Row>
          </Col>
          <Col span={8}>
            <Row gutter={8} justify="end">
              <Col>
                <Tooltip placement="top" title={searchShow ? '隐藏搜索' : '显示搜索'}>
                  <Button
                    shape="circle"
                    icon={<SearchOutlined />}
                    onClick={() => {
                      setSearchShow(!searchShow)
                    }}
                  />
                </Tooltip>
              </Col>
              <Col>
                <Tooltip placement="top" title="刷新">
                  <Button
                    shape="circle"
                    icon={<SyncOutlined />}
                    onClick={() => {
                      searchQueryFn()
                      ${data.tplCategory === 'tree' ? '' : 'setSelectKeys([])'}
                    }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="leno-table">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            rowKey="${mainIdKey}"
            size="middle"
            loading={loading}
            ${
              data.tplCategory === 'tree'
                ? `expandable={expandKeys}
            onExpand={() => setExpandKeys({})}`
                : "rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }}"
            }
          />
          ${
            data.tplCategory === 'tree'
              ? ''
              : `<Pagination
          className="pagination"
          onChange={onPagChange}
          total={dataList.count}
          showSizeChanger
          showQuickJumper
          current={queryParams.pageNum}
          showTotal={(total) => ${total}}
        />`
          }

        </div>

        {/* 添加 编辑 */}
        <Modal
          title={isAdd ? '添加${data.functionName}' : '编辑${data.functionName}'}
          open={isModalOpen}
          onOk={${data.columns.find((item) => item.htmlType === 'editor') ? 'addEditFn' : '() => addEditForm.submit()'}}
          onCancel={() => {
            setIsModalOpen(false)
            ${
              data.columns.find((item) => item.htmlType === 'fileUpload')
                ? `            const { handleUploadCancel } = fileRef.current as unknown as {
              handleUploadOk: Function
              handleUploadCancel: Function
            }
            handleUploadCancel()`
                : ''
            }
            addEditForm.resetFields()
          }}
        >
          <Form
            form={addEditForm}
            labelCol={{ span: 5 }}
            onFinish={handleFormFinish}
          >
            ${createHtmlAddEdit(data.columns)}
          </Form>
        </Modal>
      </Col>
    </Row>
  </div>
  )
}

export default ${stringFirst(data.className)}`;

  // 第八步 前端 生成typescript类型标注
  codes['react.d.ts'] = `
// 前端 类型文件
export interface I${data.businessName}DetailType {
  ${typeCreate(data.columns, 'Query')}}

export interface I${data.businessName}Type extends I${data.businessName}DetailType {
  pageNum: number
  pageSize: number
 }

// 数据列表
export interface IgetListAPI {
  code: number
  message: string
  result: {
    count: number
    rows: I${data.businessName}DetailType[]
  }
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number
  message: string
  result: I${data.businessName}DetailType
}

${
  data.tplCategory === 'tree'
    ? `export interface ITreeType {
      ${typeCreate(data.columns, 'Query')}
      children?: any[]
    }\n`
    : ''
}// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number
  message: string
  result?: null
}`;

  // 第九步 后端 生成父子表绑定
  if (data.tplCategory === 'sub') {
    codes['sub-domain.ts'] = `
    // 此父子表数据库绑定关系需剪切放置到后端文件 src/mysql/db/index.ts initRelation
        
    // ${data.tableComment}模块
    ${underlineToCamel(data.subTableName)}.hasOne(${underlineToCamel(data.tableName)}, { foreignKey: '${data.subTableFkName}', sourceKey: '${data.subTableFkName}' })
    ${underlineToCamel(data.tableName)}.belongsTo( ${underlineToCamel(data.subTableName)}, { foreignKey: '${data.subTableFkName}', targetKey: '${data.subTableFkName}', as: '${underline(
      data.subTableName,
    )}' })`;
  }

  return codes;
};
