/**
 * 字典类型
 */
import { Context } from 'koa'
import {
  getListSer,
  addSer,
  putSer,
  getDetailSer,
  getOptionselectSer,
  delSer
} from '@/business/service/system/dict_type.service'
import {
  dictTypeListType,
  userType,
  dictTypeQueryType,
  dictTypeQuerySerType,
  IdictType,
  IdictSerType
} from '@/types'
import { addJudg, putJudg } from '@/business/schema/system/sys_dict_type.schema'
import errors from '@/app/err.type'
import { formatHumpLineTransfer } from '@/business/utils'
import { excelJsExport } from '@/business/utils/excel'
import { dictTypeExcelHeader, excelBaseStyle } from '@/business/public/excelMap'
const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as dictTypeQueryType
    let newParams = { pageNum, pageSize } as dictTypeQuerySerType

    if (params.beginTime) {
      newParams.beginTime = params.beginTime
      newParams.endTime = params.endTime
    }
    params.dictName ? (newParams.dict_name = params.dictName) : null
    params.dictType ? (newParams.dict_type = params.dictType) : null
    params.status ? (newParams.status = params.status) : null

    const res = (await getListSer(newParams)) as dictTypeListType

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询字典类型列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 检查新增上传参数 judge 判断时新增或修改
export const addSchema = (judge: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const list = ctx.request['body'] as IdictType
      judge === 'add' ? await addJudg.validateAsync(list) : await putJudg.validateAsync(list)
    } catch (error) {
      console.error('新增上传参数出错', error)
      return ctx.app.emit('error', uploadParamsErr, ctx)
    }
    await next()
  }
}

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as IdictType
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')
    await addSer(newAddContent)
    await next()
  } catch (error) {
    console.error('新增用户失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(ctx.state.ids)
  } catch (error) {
    console.error('删除用户失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer({ dict_id: ctx.state.ids })
    ctx.state.formatData = res
  } catch (error) {
    console.error('用户个人信息查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 修改用户
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as IdictType
    await putSer({ ...res, updateBy: userName })

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
