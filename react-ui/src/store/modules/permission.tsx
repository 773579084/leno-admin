import React from 'react'
import { makeAutoObservable } from 'mobx'
import { RouteType } from '@/type/modules/system/menu'
import lazyLoad from '@/routes/utils/lazyLoad'
import { Navigate } from 'react-router-dom'
import useStore from '@/store'
import KeepAlive from 'react-activation'

export default class useRoutersStore {
  dynamicRouters = [] as RouteType[] // 路由表数据
  directoryList = [] as string[] // 路由表目录路径

  constructor() {
    // 响应式处理
    makeAutoObservable(this)
  }

  // 存储 routers
  setRouters = (routers: RouteType[]) => {
    this.filterRouters(routers)
    this.mapRouter(routers)
    routers.push({
      path: '*',
      element: <Navigate to="/404" />,
      hidden: true,
    })
    this.dynamicRouters = routers

    // 路由表目录路径 和 缓存路由
    this.routerDirectory(routers)
  }

  // 路由权限过滤
  filterRouters = (routers: RouteType[]) => {
    const {
      useUserStore: { permissions, roles },
    } = useStore()

    // 此步骤为过滤路由菜单级权限 目录无权限不过滤，按钮级页面过滤
    // 如果为 admin 超级管理员，则直接无需过滤权限
    if (roles.some((role) => role === 'admin')) return
    function checkPerms(routers: RouteType[]) {
      for (let i = 0; i < routers.length; i++) {
        if (routers[i].children) {
          checkPerms(routers[i].children as RouteType[])
          // 递归处理完后会判断children是否为空，为空则目录删除
          if ((routers[i].children as RouteType[]).length < 1) {
            routers.splice(i, 1)
            i--
          }
        }
        // 是否由perms字段且有值才进行权限判断
        if (!routers[i].children && routers[i].perms) {
          if (!permissions.some((item) => item === routers[i].perms)) {
            routers.splice(i, 1)
            i--
          }
        }
      }
    }
    checkPerms(routers)
  }

  // 路由映射
  mapRouter(routers: RouteType[], beforePath = '') {
    routers.forEach((router) => {
      // 组件替换
      if (!router.element) {
        delete router.element
      } else {
        // 判断 路由需要缓存的进行路由缓存包裹
        if (router.meta?.noCache) {
          // 暂时没有解决动态路由的方法，故而动态路由不缓存
          if (router.path?.indexOf(':') === -1) {
            router.element = (
              <KeepAlive
                name={beforePath + router.path}
                cacheKey={router.path}
                saveScrollPosition="screen"
              >
                {this.lazyLoadFn(router.element as string)}
              </KeepAlive>
            )
          } else {
            router.element = this.lazyLoadFn(router.element as string)
          }
        } else {
          router.element = this.lazyLoadFn(router.element as string)
        }
      }
      // 如果有children，则递归
      if (router.children) this.mapRouter(router.children, (router.path + '/') as string)
    })
  }

  // 路由懒加载
  lazyLoadFn(moduleName: string) {
    return lazyLoad(React.lazy(() => import(`@/views${moduleName}`)))
  }

  // 路由表目录路径
  routerDirectory(routers: RouteType[]) {
    const list = [] as string[]
    const keeps = [] as string[]
    function handleRouter(routers: RouteType[], beforePath = '') {
      routers.forEach((router) => {
        if (router.children) {
          list.push((beforePath + router.path) as string)
          handleRouter(router.children, (router.path + '/') as string)
        } else {
          // 无子元素则判断是否需要缓存

          if (router.meta?.noCache) {
            keeps.push(beforePath + router.path)
          }
        }
      })
    }
    handleRouter(routers)

    this.directoryList = list
  }
}
