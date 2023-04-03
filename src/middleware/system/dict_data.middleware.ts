/**
 * 字典类型
 */
import { Context } from 'koa'
import {
  getListSer,
  addSer,
  putSer,
  getDetailSer,
  exportExcelSer,
  getDataTypeSer
} from '@/service/system/dict_data.service'
import {
  dictDataListType,
  userType,
  dictDataQueryType,
  dictDataQuerySerType,
  IdictData
} from '@/types'
import { addJudg, putJudg } from '@/schema/system/sys_dict_data.schema'
import errors from '@/constants/err.type'
import { formatHumpLineTransfer } from '@/utils'
const { uploadParamsErr, getListErr, sqlErr, exportUserListErr } = errors

// 获取列表
const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as dictDataQueryType
    let newParams = { pageNum, pageSize } as dictDataQuerySerType

    params.dictLabel ? (newParams.dict_label = params.dictLabel) : null
    params.dictType ? (newParams.dict_type = params.dictType) : null
    params.status ? (newParams.status = params.status) : null

    const res = (await getListSer(newParams)) as dictDataListType

    ctx.state.formatData = res
    await next()
  } catch (error) {
    console.error('查询字典类型列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 检查新增上传参数 judge 判断时新增或修改
const addSchema = (judge: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const list = ctx.request['body'] as userType
      judge === 'add' ? await addJudg.validateAsync(list) : await putJudg.validateAsync(list)
    } catch (error) {
      console.error('新增上传参数出错', error)
      return ctx.app.emit('error', uploadParamsErr, ctx)
    }
    await next()
  }
}

// 新增
const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const addContent = ctx.request['body'] as IdictData
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line')
    await addSer(newAddContent)
    await next()
  } catch (error) {
    console.error('新增用户失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 获取详细数据
const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer({ dict_code: ctx.state.ids })
    ctx.state.formatData = res
  } catch (error) {
    console.error('用户个人信息查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 根据字典类型查询字典数据信息
const getDataTypeMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.path.split('/')
    const dictType = list[list.length - 1]
    const res = await getDataTypeSer({ dict_type: dictType })
    ctx.state.formatData = res
  } catch (error) {
    console.error('用户个人信息查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 修改用户
const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as IdictData
    console.log(91, res)

    await putSer({ ...res, updateBy: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 导出列表（excel）
const exportExcelMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await exportExcelSer()
    ctx.state.formatData = res
  } catch (error) {
    console.error('导出用户列表错误!', ctx.request['body'])
    return ctx.app.emit('error', exportUserListErr, ctx)
  }
  await next()
}

export { getListMid, getAddMid, addSchema, getDetailMid, putMid, exportExcelMid, getDataTypeMid }
