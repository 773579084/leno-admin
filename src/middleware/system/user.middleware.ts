import { Context } from 'koa'
import { getRoutersSer } from '../../service/system/menu.service'
import errors from '../../constants/err.type'
const { getRoutersErr } = errors

// 生成前端menu路由
const getRouterMid = async (ctx: Context, next: () => Promise<void>) => {}

export { getRouterMid }
