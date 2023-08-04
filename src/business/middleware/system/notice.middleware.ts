import { Context } from 'koa'
import {
  getListSer,
  addSer,
  putSer,
  getDetailSer,
  delSer,
  queryConditionsData,
  addAllSer
} from '@/business/service'
import { userType } from '@/types'
import { InoticeQueryType, InoticeQuerySerType, Inotice, InoticeSer } from '@/types/system/notice'
import errors from '@/app/err.type'
import { formatHumpLineTransfer, removeSpecifyFile } from '@/business/utils'
import SysNotice from '@/mysql/model/system/notice.model'
import { Op } from 'sequelize'
import SysNoticeDept from '@/mysql/model/system/sys_notice_role.model'
const { uploadParamsErr, getListErr, sqlErr, delErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as InoticeQueryType
    let newParams = { pageNum, pageSize } as InoticeQuerySerType

    params.noticeTitle ? (newParams.notice_title = { [Op.like]: params.noticeTitle + '%' }) : null
    params.createBy ? (newParams.create_by = { [Op.like]: params.createBy + '%' }) : null

    const res = await getListSer<InoticeQuerySerType>(SysNotice, newParams)

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
    const addContent = ctx.request['body'] as Inotice
    const addContent2 = { ...addContent, createBy: userName }
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as InoticeSer

    await addSer<InoticeSer>(SysNotice, newAddContent)
    await next()
  } catch (error) {
    console.error('新增失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 拿取图片信息，有则删除
    const { imgs } = await getDetailSer<InoticeSer>(SysNotice, { notice_id: ctx.state.ids })
    if (imgs) {
      JSON.parse(imgs).forEach((item: string) => removeSpecifyFile(item))
    }

    // 删除noticeId之前的关系
    await delSer(SysNoticeDept, { notice_id: ctx.state.ids })

    await delSer(SysNotice, { notice_id: ctx.state.ids })
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<InoticeSer>(SysNotice, { notice_id: ctx.state.ids })

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
    const res = ctx.request['body'] as Inotice
    const lineData = formatHumpLineTransfer(res, 'line') as InoticeSer
    const { notice_id, ...data } = lineData

    await putSer<InoticeSer>(SysNotice, { notice_id }, { ...data, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

// 用通知id 获取部门
export const getDeptsMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const depts = await queryConditionsData(SysNoticeDept, { notice_id: ctx.state.ids })
    ctx.state.formatData = depts.map((item: any) => {
      return item.dept_id
    })
  } catch (error) {
    console.error('详细数据查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 存储通知部门关系
export const addNoticeDeptMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const noticeDept = ctx.request?.body as {
      noticeId: string
      deptIds: string[]
    }

    // 删除noticeId之前的关系
    await delSer(SysNoticeDept, { notice_id: noticeDept.noticeId })

    // 重新新增关系
    const res = await addAllSer(
      SysNoticeDept,
      noticeDept.deptIds.map((item) => {
        return {
          notice_id: noticeDept.noticeId,
          dept_id: item
        }
      })
    )

    ctx.state.formatData = res
  } catch (error) {
    console.error('存储通知部门关系', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}

// 用部门id 获取通知内容（其他模块使用）
export const noticeContentMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 获取noticeids
    const noticeList = await queryConditionsData(SysNoticeDept, { dept_id: ctx.state.ids })

    // 用noticeids获取notice们的noticeContent
    const noticeIds = [...new Set(noticeList.map((item) => item.notice_id))]

    const notices = await queryConditionsData(SysNotice, { notice_id: noticeIds })

    ctx.state.formatData = notices
  } catch (error) {
    console.error('详细数据查询错误', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }

  await next()
}
