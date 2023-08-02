import { message, Tabs } from 'antd'
import React, { useEffect } from 'react'
import { HomeOutlined, CloseOutlined } from '@ant-design/icons'
import classes from './index.module.scss'
import { HOME_URL } from '@/config/config'
import { useNavigate, useLocation } from 'react-router-dom'
import { tbasType, tbasKeyType } from '@/type'
import DelTabs from './components/DelTabs'
// mobx
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import useStore from '@/store'
import { RouteType } from '@/type/modules/system/menu'

const TabsCom = () => {
  const {
    useRoutersStore: { dynamicRouters },
    useLayoutStore: { defaultObjMobx, changeTabsListMobx, layoutSet },
  } = useStore()
  // 删除路由缓存

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tabsArr = toJS(defaultObjMobx.tabsListMobx) as tbasType[]

  //#region  add tabsArr
  useEffect(() => {
    addTabsArr()
  }, [pathname])

  const addTabsArr = () => {
    // 找出当前面包屑路由
    let currentPath = pathname.split('/')[pathname.split('/').length - 1]
    let route = {} as RouteType
    try {
      findCurrentRoute(dynamicRouters)
    } catch (error) {}

    function findCurrentRoute(routes: any) {
      routes.forEach((_route: RouteType) => {
        if (_route.children instanceof Array) {
          findCurrentRoute(_route.children)
        } else {
          if (_route.path?.indexOf('/:') !== -1) {
            if (pathname.indexOf(_route.path?.split('/:')[0] as string) !== -1) {
              currentPath = pathname.split('/')[pathname.split('/').length - 2]
              route = _route
              throw new Error('找到就结束循环')
            }
          } else {
            if (
              pathname.indexOf(_route.path) !== -1 ||
              (pathname === '/' && _route.path === HOME_URL)
            ) {
              route = _route
            }
          }
        }
      })
    }
    // 判断当前的pathname 在 tabsArr里面有没有
    let isSetTab = false
    try {
      tabsArr.forEach((tab) => {
        if (tab.path === pathname) {
          isSetTab = true
          throw new Error('找到就结束循环')
        }
      })
    } catch (error) {}

    if (!isSetTab) {
      let routePath = route.path?.split('/') as string[]

      if (routePath && !routePath[0]) {
        routePath[0] = routePath[1]
      }

      routePath &&
        routePath[0] === currentPath &&
        changeTabsListMobx([...tabsArr, { path: pathname, title: route.meta?.title as string }])
    }
  }
  //#endregion

  const navigateFn = (path: string) => {
    // 此处默认返回子元素的key
    navigate(path)
  }

  // del tab
  const delTabFn = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    path: string,
    delTabType?: string,
  ) => {
    // 如果未首页，提示不可删除
    e.stopPropagation()
    let newTabs: tbasType[] = []
    if (delTabType === 'all') {
      newTabs = tabsArr.filter((item) => item.path === HOME_URL)
      navigate(HOME_URL)
    }
    if (delTabType === 'otherAll') {
      newTabs = tabsArr.filter((item) => item.path === path || item.path === HOME_URL)
    }
    if (!delTabType) {
      if (path === HOME_URL) return message.warning('首页不可删除！')
      const currentIndex = tabsArr.findIndex((item) => item.path === path)
      newTabs = tabsArr.filter((item) => item.path !== path)
      if (path === pathname) navigate(tabsArr[currentIndex - 1].path as string)
    }
    changeTabsListMobx(newTabs)
  }

  // 渲染 标签页
  const items = () => {
    let tabs = [] as tbasKeyType[]
    tabsArr.forEach((item) => {
      tabs.push({
        label: (
          <span>
            {item.path === HOME_URL ? <HomeOutlined /> : ''}
            {item.title}
            {item.path !== HOME_URL ? (
              <CloseOutlined
                className={classes['del-icon']}
                onClick={(e) => delTabFn(e, item.path as string)}
              />
            ) : null}
          </span>
        ),
        key: item.path,
      })
    })
    return tabs
  }

  return (
    <div hidden={!layoutSet.tagsView} className={classes['layout-tabs']}>
      <div className={classes['layout-tabs-page']}>
        <Tabs activeKey={pathname} onChange={navigateFn} items={items()}></Tabs>
      </div>
      <DelTabs delTabFn={delTabFn} />
    </div>
  )
}

export default observer(TabsCom)
