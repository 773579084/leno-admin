import { Context } from 'koa'
import { getListSer, addSer, putSer, getDetailSer } from '@/business/service'
import { userType, IdictType } from '@/types'
import errors from '@/app/err.type'
import { formatHumpLineTransfer, removeFolder } from '@/business/utils'
const { uploadParamsErr, getListErr, sqlErr, delErr } = errors
import { Op } from 'sequelize'
import {
  genQueryDbSerType,
  genQuerySerType,
  genQueryType,
  GenSerType,
  GenType
} from '@/types/tools/gen'
import ToolGen from '@/mysql/model/tool/gen.model'
import redis from '@/redis'
import sequelize from '@/mysql/db/seq.db'
import { conversionTables, generateCode } from '@/business/utils/tools'
import ToolGenColumn from '@/mysql/model/tool/gen_column.model'
import fs from 'fs'
import archiver from 'archiver'
import SysMenu from '@/mysql/model/system/menu.model'

// 查询数据库所有的表 -》 并将表数据转换为代码生成表的数据
export const findAllSqlMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const existNames = await redis.smembers('tool_sql_names')
    // const existNames = []
    // 1、获取数据库里面所有的sql名字
    const tables = await sequelize.getQueryInterface().showAllTables()

    // 将新增 sql 表的表面存储到 newAddRedisNames
    const newAddRedisNames = []
    // 1-1、 判断sql表是否已经生成过数据了
    tables.forEach((name, index) => {
      if (!existNames.includes(name)) {
        // 1-1-1、将新增tables表名存储到redis做缓存
        newAddRedisNames.push(name)
        redis.sadd('tool_sql_names', name)
      } else {
      }
    })

    if (newAddRedisNames.length > 0) await conversionTables(newAddRedisNames)

    await next()
  } catch (error) {
    console.error('查询数据库所有的表', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }
}

// 获取db列表
export const getListDbMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as genQueryType
    let newParams = { pageNum, pageSize, is_import: '1' } as genQueryDbSerType

    params.tableName ? (newParams.table_name = params.tableName) : null
    params.tableComment ? (newParams.table_comment = params.tableComment) : null

    const res = await getListSer<genQueryDbSerType>(ToolGen, newParams)

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询代码生成列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 导入表
export const importTableMid = async (ctx: Context, next: () => Promise<void>) => {
  const list = ctx.request.path.split('/')
  const tableList = list[list.length - 1]
  const tables = tableList.split(',')
  const { userName } = ctx.state.user as userType

  await putSer(ToolGen, { table_name: tables }, { is_import: '0', update_by: userName })

  await next()
}

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as genQueryType
    let newParams = { pageNum, pageSize, is_import: '0' } as genQuerySerType

    if (params.beginTime) {
      newParams.created_at = {
        [Op.between]: [params.beginTime, params.endTime]
      }
    }
    params.tableName ? (newParams.table_name = params.tableName) : null
    params.tableComment ? (newParams.table_comment = params.tableComment) : null

    const res = await getListSer<genQuerySerType>(ToolGen, newParams)

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询代码生成列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 获取Sql列表
export const getListSqlMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    let newParams = { pageNum: 1, pageSize: 1000 } as genQuerySerType

    const res = await getListSer<genQuerySerType>(ToolGen, newParams, {
      include: [
        {
          model: ToolGenColumn,
          as: 'columns'
        }
      ]
    })

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询代码生成列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 导入生成表模板
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as IdictType
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')
    await addSer(ToolGen, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await putSer(ToolGen, { table_id: ctx.state.ids }, { is_import: '1' })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 修改用户
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as GenType
    const newRes = formatHumpLineTransfer(res, 'line') as unknown as GenSerType

    const { table_id, columns, ...genDate } = newRes

    // 基本信息修改
    await putSer(ToolGen, { table_id }, { ...genDate, update_by: userName })

    // 修改信息
    columns.forEach(async (column) => {
      const { table_id, column_id, created_at, updated_at, create_by, ...data } = column

      await putSer(ToolGenColumn, { column_id }, { ...data, update_by: userName })
    })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 代码预览
export const codePreviewMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const id = ctx.state.ids[0]

    // 查找 相关表和表字段的所有数据
    const res = await getDetailSer(
      ToolGen,
      { table_id: id },
      {
        include: [
          {
            model: ToolGenColumn,
            as: 'columns'
          }
        ]
      }
    )
    const newRows = formatHumpLineTransfer(res) as unknown as GenType
    const code = generateCode(newRows)
    ctx.state.formatData = code

    await next()
  } catch (error) {
    console.error('代码预览查询失败', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }
}

// 生成压缩包
export const batchGenCodeMid = async (ctx: Context, next: () => Promise<void>) => {
  const ids = ctx.state.ids

  try {
    const { rows } = await getListSer<genQuerySerType>(
      ToolGen,
      { pageNum: 1, pageSize: 1000, table_id: ids },
      {
        include: [
          {
            model: ToolGenColumn,
            as: 'columns'
          }
        ]
      }
    )

    const newRows = formatHumpLineTransfer(rows)

    // 1 创建放置前端代码和后端代码的文件夹
    const createFile = ['node', 'react']
    createFile.forEach((fileName) => {
      fs.mkdir(`src/${fileName}`, (err) => {
        if (err) console.log(236, err)
      })
    })
    // 2 遍历生成页面代码写入到文件夹里，然后统一打包成压缩包发送给前端
    newRows.forEach((row: GenType) => {
      const frontFile = ['api.ts', 'index.tsx', 'index-tree.tsx', 'react.d.ts']
      const code = generateCode(row)
      // 3 创建业务模块 文件
      createFile.forEach((fileName) => {
        fs.mkdir(`src/${fileName}/${row.businessName}`, (err) => {
          if (err) console.log(246, err)
        })
      })

      // 4、将业务文件分别写入 node 和 react 文件夹下
      for (const key in code) {
        if (!frontFile.includes(key)) {
          let newKey = ''
          if (key.indexOf('node') !== -1) {
            const keyList = key.split('.')
            keyList.splice(0, 1)
            newKey = keyList.join('.')
          } else {
            newKey = key
          }

          fs.writeFile(
            `src/node/${row.businessName}/${row.businessName}.${newKey}`,
            code[key],
            (err) => {
              if (err) console.log(266, err)
            }
          )
        } else {
          let newKey = ''
          if (key.indexOf('react') !== -1) {
            const keyList = key.split('.')
            keyList.splice(0, 1)
            newKey = keyList.join('.')
          } else {
            newKey = key
          }
          const businessName =
            newKey.indexOf('d.ts') !== -1
              ? `${row.businessName}.${newKey}`
              : row.businessName + '.' + newKey.split('.')[newKey.split('.').length - 1]

          fs.writeFile(`src/react/${row.businessName}/${businessName}`, code[key], (err) => {
            if (err) console.log(282, err)
          })
        }
      }
    })
  } catch (error) {
    console.error('生成代码）', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  try {
    // 5 压缩刚刚创建的代码文件
    const filePaths = ['src\\node', 'src\\react']

    const output = fs.createWriteStream('leno-admin.zip')
    const archive = archiver('zip', {
      zlib: { level: 9 } // 设置压缩级别
    })

    archive.on('error', function (err) {
      if (err) err
    })

    archive.pipe(output)
    for (const i of filePaths) {
      archive.directory(i, 'leno-admin\\' + i.split('\\')[1])
    }
    // 生成完后将zip文件删除
    output.on('close', () => {
      fs.unlinkSync('leno-admin.zip')
      // 6 删除刚刚生成的文件
      filePaths.forEach((path) => {
        removeFolder(path)
      })
    })
    archive.finalize()
    ctx.state.buffer = archive

    await next()
  } catch (error) {
    console.error('生成压缩包', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }
}

// 生成代码（写到指定文件夹）
export const genCodeMid = async (ctx: Context, next: () => Promise<void>) => {
  const ids = ctx.state.ids

  try {
    const { rows } = await getListSer<genQuerySerType>(
      ToolGen,
      { pageNum: 1, pageSize: 1000, table_id: ids },
      {
        include: [
          {
            model: ToolGenColumn,
            as: 'columns'
          }
        ]
      }
    )

    const newRows = formatHumpLineTransfer(rows)

    // 统一生成业务文件夹
    newRows.forEach((row: GenType) => {
      // 创建业务文件夹
      const packageName = row.packageName.split('.').join('/')
      const genPath = row.genPath === '/' ? `src/${packageName}` : row.genPath

      fs.mkdir(`${genPath}/${row.businessName}`, (err) => {
        if (err) console.log(246, err)
      })
    })
    // 遍历生成页面代码写入到文件夹里，然后统一打包成压缩包发送给前端
    newRows.forEach(async (row: GenType) => {
      const frontFile = ['api.ts', 'index.tsx', 'index-tree.tsx', 'react.d.ts']
      const code = generateCode(row)
      const packageName = row.packageName.split('.').join('/')
      const genPath = row.genPath === '/' ? `src/${packageName}` : row.genPath

      // 在业务文件内创建 node 和 react 文件夹
      fs.mkdir(`${genPath}/${row.businessName}/node`, (err) => {
        if (err) console.log(236, err)
      })
      fs.mkdir(`${genPath}/${row.businessName}/react`, (err) => {
        if (err) console.log(236, err)
      })

      // 将业务文件分别写入 node 和 react 文件夹下
      for (const key in code) {
        if (!frontFile.includes(key)) {
          let newKey = ''
          if (key.indexOf('node') !== -1) {
            const keyList = key.split('.')
            keyList.splice(0, 1)
            newKey = keyList.join('.')
          } else {
            newKey = key
          }

          fs.writeFile(
            `${genPath}/${row.businessName}/node/${row.businessName}.${newKey}`,
            code[key],
            (err) => {
              if (err) console.log(266, err)
            }
          )
        } else {
          let newKey = ''
          if (key.indexOf('react') !== -1) {
            const keyList = key.split('.')
            keyList.splice(0, 1)
            newKey = keyList.join('.')
          } else {
            newKey = key
          }
          const businessName =
            newKey.indexOf('d.ts') !== -1
              ? `${row.businessName}.${newKey}`
              : row.businessName + '.' + newKey.split('.')[newKey.split('.').length - 1]

          fs.writeFile(`${genPath}/${row.businessName}/react/${businessName}`, code[key], (err) => {
            if (err) console.log(282, err)
          })
        }
      }

      // 判断是否选择了 上级菜单
      if (row.parentId) {
        await addSer(SysMenu, {
          menu_type: 'C',
          icon: row.businessName,
          menu_name: row.functionName,
          order_num: 0,
          is_cache: 0,
          is_frame: 1,
          parent_id: row.parentId,
          path: row.businessName,
          perms: `${row.moduleName}:${row.businessName}:list`,
          component: `/${row.moduleName}/${row.businessName}`,
          status: '0',
          visible: '0'
        })
      }
    })

    await next()
  } catch (error) {
    console.error('生成代码', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }
}
