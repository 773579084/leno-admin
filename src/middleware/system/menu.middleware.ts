import { Context } from 'koa'
import {
  getRoutersSer,
  getMenusSer,
  addSer,
  delSer,
  getDetailSer,
  putSer
} from '@/service/system/menu.service'
import { formatHumpLineTransfer } from '@/utils'
import { menusType, RouteType, userType } from '@/types'
import { addJudg, putJudg } from '@/schema/system/sys_menus.schema'
import errors from '@/constants/err.type'
const { delErr, getRoutersErr, getListErr, uploadParamsErr, addErr, sqlErr } = errors

// 获取菜单数据并进行数据转换
const conversionMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 获取数据库菜单数据
    const firstRes = await getRoutersSer()
    const newRes = formatHumpLineTransfer(firstRes, 'hump')
    ctx.state.menus = newRes
    // 按照路由格式存储一级菜单
  } catch (error) {
    console.error('前端路由获取失败', error)
    return ctx.app.emit('error', getRoutersErr, ctx)
  }
  await next()
}

// 生成前端menu路由
const getRouterMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const menus = ctx.state.menus
    const routers = [] as RouteType[]
    menus.sort((a: { orderNum: number }, b: { orderNum: number }) => a.orderNum - b.orderNum)

    menus.forEach((menu: menusType) => {
      if (menu.parentId === 0) {
        const route = {} as RouteType
        Object.assign(route, {
          name: menu.path,
          path: '/' + menu.path,
          alwaysShow: menu.menuType === 'M' ? true : false,
          element: menu.component,
          hidden: menu.visible === '0' ? false : true,
          children: [],
          meta: {
            title: menu.menuName,
            link: menu.isFrame ? null : menu.path,
            noCache: menu.isCache ? false : true,
            icon: menu.icon
          }
        })
        createRoute(route, menu.menuId)

        if (route.children && route.children.length < 1) {
          delete route.children
        }
        routers.push(route)
      }
    })

    function createRoute(route: RouteType, parentId: number) {
      menus.forEach((menu: menusType) => {
        if (menu.parentId === parentId) {
          const routeChild = {
            name: menu.path,
            path: menu.path,
            alwaysShow: menu.menuType === 'M' ? true : false,
            element: menu.component,
            hidden: menu.visible === '0' ? false : true,
            children: [],
            meta: {
              title: menu.menuName,
              link: menu.isFrame ? null : menu.path,
              noCache: menu.isCache ? false : true,
              icon: menu.icon
            }
          }
          route.children.push(routeChild)

          createRoute(routeChild, menu.menuId)
        }
      })

      if (route.children.length < 1) {
        delete route.children
      }
    }

    ctx.state.formatData = routers
    // 按照路由格式存储一级菜单
  } catch (error) {
    console.error('前端路由创建失败', error)
    return ctx.app.emit('error', getRoutersErr, ctx)
  }
  await next()
}

// 获取菜单列表
const getMenusMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const params = ctx.query as unknown as menusType
    // 获取数据库菜单数据
    const res = await getMenusSer(params)
    ctx.state.formatData = res
  } catch (error) {
    console.error('菜单列表获取失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
  await next()
}

// 检查新增上传参数 judge 判断时新增或修改
const addEditSchema = (judge: string) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      const list = ctx.request['body'] as menusType
      judge === 'add' ? await addJudg.validateAsync(list) : await putJudg.validateAsync(list)
    } catch (error) {
      console.error('新增上传参数出错', error)
      return ctx.app.emit('error', uploadParamsErr, ctx)
    }
    await next()
  }
}

// 新增
const addMenuMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request['body'] as menusType
    const menu = formatHumpLineTransfer(list, 'line')
    // 获取数据库菜单数据
    await addSer(menu)
  } catch (error) {
    console.error('新增菜单失败', error)
    return ctx.app.emit('error', addErr, ctx)
  }
  await next()
}

// 删除
const delMenuMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(ctx.state.ids)
  } catch (error) {
    console.error('删除用户失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }
  await next()
}

// 获取详情
const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer({ menu_id: ctx.state.ids })
    ctx.state.formatData = res
  } catch (error) {
    console.error('获取详情失败', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }
  await next()
}

// 修改用户
const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as menusType
    const menu = formatHumpLineTransfer(res, 'line')
    await putSer({ ...menu, updateBy: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}

export {
  getRouterMid,
  conversionMid,
  getMenusMid,
  addEditSchema,
  addMenuMid,
  delMenuMid,
  getDetailMid,
  putMid
}
