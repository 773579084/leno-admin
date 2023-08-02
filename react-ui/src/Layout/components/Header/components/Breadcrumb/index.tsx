import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import classes from './index.module.scss'
// mobx
import useStore from '@/store'
import { HOME_URL } from '@/config/config'
import { RouteType } from '@/type/modules/system/menu'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'

const BreadcrumbCom = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const {
    useRoutersStore: { dynamicRouters },
    useLayoutStore: { changeBreadCrumbListFn, defaultObjMobx, layoutSet },
  } = useStore()

  const [newBreadcrumbArr, setNewBreadcrumbArr] = useState(defaultObjMobx.breadcrumbListMobx)
  let breadcrumbArr: string[] = []

  // 遍历找处路径 title 数组
  const currentBreadArr = (route: RouteType) => {
    route.meta?.title && breadcrumbArr.push(route.meta.title as string)
    if (route.children) {
      route.children.forEach((item: RouteType) => {
        // 规避动态路由情况
        if (pathname.indexOf(item.path?.split('/:')[0] as string) !== -1) currentBreadArr(item)
      })
    }
  }

  useEffect(() => {
    let route: RouteType = {
      element: undefined,
    }

    // 找出当前面包屑路由
    toJS(dynamicRouters).forEach((item) => {
      if (pathname.indexOf(item.path as string) !== -1) route = item
    })

    // 拼接面包屑的路径
    currentBreadArr(route)
    // 动态设置 title
    if (layoutSet.dynamicTitle) {
      document.title = `${breadcrumbArr[breadcrumbArr.length - 1]} - Leno Admin`
    }

    setNewBreadcrumbArr(breadcrumbArr)
    changeBreadCrumbListFn(breadcrumbArr)
  }, [pathname])

  return (
    <Breadcrumb className={classes['bread-crumb']} style={{ marginLeft: 16 }}>
      <Breadcrumb.Item
        className={pathname === HOME_URL ? classes['current-home'] : classes.home}
        onClick={() => navigate(HOME_URL)}
      >
        首页
      </Breadcrumb.Item>
      {pathname === HOME_URL
        ? null
        : newBreadcrumbArr.map((item, index) => {
            return (
              <Breadcrumb.Item
                className={
                  newBreadcrumbArr.length - 1 === index
                    ? classes['current-bread']
                    : classes['nocurrent-bread']
                }
                key={index}
              >
                {item}
              </Breadcrumb.Item>
            )
          })}
    </Breadcrumb>
  )
}

export default observer(BreadcrumbCom)
