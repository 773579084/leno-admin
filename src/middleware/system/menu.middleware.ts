import { Context } from 'koa'
import { getRoutersSer } from '@/service/system/menu.service'
import { formatHumpLineTransfer } from '@/utils'
import { menusType, RouteType } from '@/types'
import errors from '@/constants/err.type'
const { getRoutersErr } = errors

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

        if (route.children.length < 1) {
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
          }
          route.children.push(routeChild)

          createRoute(routeChild, menu.menuId)
        }
      })

      if (route.children.length < 1) {
        delete route.children
      }
    }

    ctx.state.routers = routers
    // 按照路由格式存储一级菜单
  } catch (error) {
    console.error('前端路由创建失败', error)
    return ctx.app.emit('error', getRoutersErr, ctx)
  }
  await next()
}

export { getRouterMid, conversionMid }
