import { Context } from 'koa'
import { getRoutersSer } from '../../service/system/menu.service'
import errors from '../../constants/err.type'
const { getRoutersErr } = errors

// 生成前端menu路由
const getRouterMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const routes = [] as any
    // 获取数据库菜单数据
    const firstRes = await getRoutersSer(0)
    // 按照路由格式存储一级菜单

    // 创建一级菜单
    /**
     * 此处嵌套遍历不可以使用 forEach ，会存在异步的问题
     * 需要使用 for 循环
     */
    for (let i = 0; i < firstRes.length; i++) {
      const firstRoute = {
        alwaysShow: firstRes[i].menu_type === 'M',
        children: [],
        element: firstRes[i].component,
        hidden: firstRes[i].visible,
        meta: {
          icon: firstRes[i].icon,
          link: firstRes[i].is_frame ? '' : firstRes[i].path,
          noCache: firstRes[i].is_cache,
          title: firstRes[i].menu_name
        },
        name: firstRes[i].path,
        path: firstRes[i].is_frame ? '/' + firstRes[i].path : firstRes[i].path
      }
      // 查找二级菜单
      const secondRes = await getRoutersSer(firstRes[i].menu_id)
      // 创建二级菜单，并且将二级菜单推入一级菜单的children中
      for (let i2 = 0; i2 < secondRes.length; i2++) {
        firstRoute.children.push({
          component: secondRes[i2].component,
          children: [],
          hidden: secondRes[i2].visible,
          name: secondRes[i2].path,
          path: secondRes[i2].is_frame ? secondRes[i2].path : secondRes[i2].path,
          meta: {
            icon: secondRes[i2].icon,
            link: secondRes[i2].is_frame ? '' : secondRes[i2].path,
            noCache: secondRes[i2].is_cache,
            title: secondRes[i2].menu_name
          }
        })
        // 查找三级菜单
        const threeRes = await getRoutersSer(secondRes[i2].menu_id)
        for (let i3 = 0; i3 < threeRes.length; i3++) {
          firstRoute.children[i2].children.push({
            component: threeRes[i3].component,
            hidden: threeRes[i3].visible,
            name: threeRes[i3].path,
            path: threeRes[i3].is_frame ? threeRes[i3].path : threeRes[i3].path,
            meta: {
              icon: threeRes[i3].icon,
              link: threeRes[i3].is_frame ? '' : threeRes[i3].path,
              noCache: threeRes[i3].is_cache,
              title: threeRes[i3].menu_name
            }
          })
        }
      }
      routes.push(firstRoute)
    }
    ctx.state.menus = routes
    await next()
  } catch (error) {
    console.error('前端路由创建失败', error)
    return ctx.app.emit('error', getRoutersErr, ctx)
  }
}

export { getRouterMid }
