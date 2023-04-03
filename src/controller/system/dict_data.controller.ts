import { Context } from 'koa'
import { delSer } from '@/service/system/dict_data.service'
import errors from '@/constants/err.type'
const { delErr } = errors
import { excelBaseStyle, dictDataExcelHeader } from '@/public/map'
import { excelJsExport } from '@/utils'

class DictTypeController {
  // 生成列表
  async getListCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '查询成功！',
      result: ctx.state.formatData
    }
  }

  // 删除
  async delUserCon(ctx: Context, next: () => Promise<void>) {
    try {
      await delSer(ctx.state.ids)
    } catch (error) {
      console.error('删除用户失败', error)
      return ctx.app.emit('error', delErr, ctx)
    }
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '删除用户成功！',
      result: ''
    }
  }

  // 新增
  async getAddCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '新增用户成功！'
    }
  }

  // 获取详细数据
  async getDetailCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '详细数据获取成功！',
      result: ctx.state.formatData
    }
  }

  // 修改信息
  async putCon(ctx: Context, next: () => Promise<void>) {
    // 3、返回结果
    ctx.body = {
      code: 200,
      message: '修改成功！',
      result: ctx.state.formatData
    }
  }

  // 导出列表
  async exportExcelCon(ctx: Context, next: () => Promise<void>) {
    const list = ctx.state.formatData
    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '字典管理数据',
      style: excelBaseStyle,
      headerColumns: dictDataExcelHeader,
      tableData: list
    })
    // 3、返回结果
    ctx.body = buffer
  }
}

export const { getListCon, delUserCon, getAddCon, getDetailCon, putCon, exportExcelCon } =
  new DictTypeController()
