import { Context } from 'koa'
import { getRoutersSer } from '../../service/system/menu.service'
import errors from '../../constants/err.type'
const { getRoutersErr } = errors

// 生成用户列表
const getUserListMid = async (ctx: Context, next: () => Promise<void>) => {}

export { getUserListMid }
