import { Context } from 'koa'
import { getRoutersSer, getMenusSer } from '@/business/service/system/menu.service'
import { addSer, delSer, getDetailSer, putSer } from '@/business/service'
import { formatHumpLineTransfer } from '@/business/utils'
import { MenuParamsType, menusSqlType, menusType, RouteType, userType } from '@/types'
import { addJudg, putJudg } from '@/business/schema/system/sys_menus.schema'
import errors from '@/app/err.type'
import SysMenu from '@/mysql/model/system/menu.model'
const { delErr, getRoutersErr, getListErr, uploadParamsErr, addErr, sqlErr } = errors

// 获取菜单数据并进行数据转换
export const conversionMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 获取数据库菜单数据
    const firstRes = await getRoutersSer()
    const newRes = formatHumpLineTransfer(firstRes, 'hump')
    ctx.state.menus = newRes
  } catch (error) {
    console.error('前端路由获取失败', error)
    return ctx.app.emit('error', getRoutersErr, ctx)
  }
  await next()
}

// 生成前端menu路由
export const getRouterMid = async (ctx: Context, next: () => Promise<void>) => {
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
          query: menu.query,
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
            query: menu.query,
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
export const getMenusMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const params = ctx.query as unknown as MenuParamsType
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
export const addEditSchema = (judge: string) => {
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
export const addMenuMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request['body'] as menusType
    const menu = formatHumpLineTransfer(list, 'line')
    // 获取数据库菜单数据
    await addSer(SysMenu, menu)
  } catch (error) {
    console.error('新增菜单失败', error)
    return ctx.app.emit('error', addErr, ctx)
  }
  await next()
}

// 删除
export const delMenuMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await delSer(SysMenu, { menu_id: ctx.state.ids })
  } catch (error) {
    console.error('删除用户失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }
  await next()
}

// 获取详情
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer(SysMenu, { menu_id: ctx.state.ids })
    ctx.state.formatData = res
  } catch (error) {
    console.error('获取详情失败', error)
    return ctx.app.emit('error', sqlErr, ctx)
  }
  await next()
}

// 修改用户
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType
    const res = ctx.request['body'] as menusType
    const menu = formatHumpLineTransfer(res, 'line') as unknown as menusSqlType
    const { menu_id, ...data } = menu
    await putSer(SysMenu, { menu_id }, { ...data, update_by: userName })

    await next()
  } catch (error) {
    console.error('修改失败', error)
    return ctx.app.emit('error', uploadParamsErr, ctx)
  }
}
