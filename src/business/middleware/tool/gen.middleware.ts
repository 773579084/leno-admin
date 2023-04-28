/**
 * 字典类型
 */
import { Context } from 'koa'
import { getOptionselectSer } from '@/business/service/system/dict_type.service'
import { getListSer, addSer, putSer, getDetailSer, delSer } from '@/business/service'
import { userType, IdictType, IdictSerType } from '@/types'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import { dictTypeExcelHeader, excelBaseStyle } from '@/business/public/excelMap'
import DictType from '@/mysql/model/system/dict_type.model'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors
import { Op } from 'sequelize'
import { genQuerySerType, genQueryType } from '@/types/tools/gen'
import Gen from '@/mysql/model/tool/gen.model'
import GenColumn from '@/mysql/model/tool/gen_column.model'
import redis from '@/redis'

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as genQueryType
    let newParams = { pageNum, pageSize } as genQuerySerType

    if (params.beginTime) {
      newParams.created_at = {
        [Op.between]: [params.beginTime, params.endTime]
      }
    }
    params.tableName ? (newParams.table_name = params.tableName) : null
    params.tableComment ? (newParams.table_comment = params.tableComment) : null

    const res = await getListSer<genQuerySerType>(Gen, newParams, {
      include: [{ model: GenColumn, as: 'columns' }]
    })

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询代码生成列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as IdictType
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')
    await addSer(Gen, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(Gen, { table_id: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 查询还未导入的表模板
export const getDbListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    let newParams = { pageNum: 1, pageSize: 10000 }
    const res = await getListSer<genQuerySerType>(Gen, newParams, {
      include: [{ model: GenColumn, as: 'columns' }]
    })

    ctx.state.formatData = res
  } catch (error) {
    console.error('查询还未导入的表模板失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
  await next()
}

// 修改用户
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as IdictType
    const newRes = formatHumpLineTransfer(res, 'line') as IdictSerType
    const { dict_id, ...date } = newRes

    await putSer(DictType, { dict_id }, { ...date, updateBy: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 获取字典选择框列表
export const getOptionselectMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = (await getOptionselectSer()) as IdictSerType[]

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询字典选择框列表列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData
    const dicts = ctx.state.dicts

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '字典管理数据',
      style: excelBaseStyle,
      headerColumns: dictTypeExcelHeader,
      tableData: list,
      dicts: dicts
    })

    ctx.state.buffer = buffer
    await next()
  } catch (error) {
    console.error('导出失败', error)
    return ctx.app.emit('error', exportExcelErr, ctx)
  }
}
