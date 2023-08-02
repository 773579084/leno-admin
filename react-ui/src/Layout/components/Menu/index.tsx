import React, { useState, useEffect } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
// mobx
import useStore from '@/store'
import { toJS } from 'mobx'
import SvgIcon from '@/components/SvgIcon'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { RouteType } from '@/type/modules/system/menu'
import { PropsType } from '@/type'

const MenuCom: React.FC<PropsType> = ({ collapsed }) => {
  const {
    useLayoutStore: { changeSelectedKeys, defaultObjMobx },
    useRoutersStore: { dynamicRouters, directoryList },
  } = useStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultObjMobx.selectedKeysMobx)

  useEffect(() => {
    if (!collapsed)
      setOpenKeys(
        directoryList.filter((item) => {
          return pathname.indexOf(item) !== -1
        }),
      )
  }, [collapsed])

  //#region 保存 menu 展开
  const onOpenChange = (openKeys: string[]) => {
    const lastKeyName = openKeys[openKeys.length - 1] && openKeys[openKeys.length - 1].split('/')[1]

    if (openKeys.length > 1) {
      for (let i = openKeys.length - 2; i >= 0; i--) {
        if (openKeys[i].indexOf(lastKeyName) === -1) {
          // 如果和之前的openKeys都不一样，则说明换目录了，赋值最新的值
          setOpenKeys([openKeys[openKeys.length - 1]])

          return
        }
      }
    }
    setOpenKeys(openKeys)
  }
  //#endregion

  type MenuItem = Required<MenuProps>['items'][number]
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null,
    query?: string,
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children,
      query,
    } as MenuItem
  }

  // 生成  menu
  function createMenuFn(dynamicRouters: RouteType[], isAlwaysShow?: boolean, onPath: string = '') {
    const newItems: ItemType[] = []

    toJS(dynamicRouters).forEach((route: RouteType) => {
      if (route.alwaysShow || isAlwaysShow) {
        if (!route.hidden) {
          // 多级目录
          let frontPath: string = ''
          if (!onPath) {
            frontPath = route.path as string
          } else {
            frontPath = onPath + '/' + route.path
          }

          newItems.push(
            getItem(
              route.meta?.link ? (
                <a href={route.meta?.link} target="_blank" rel="noopener noreferrer">
                  {route.meta?.title}
                </a>
              ) : (
                route.meta?.title
              ),
              frontPath,
              <SvgIcon iconClass={route.meta?.icon as string} style={{ marginRight: 5 }} />,
              route.children && createMenuFn(route.children, true, frontPath),
              route.query,
            ),
          )
        }
      } else {
        // 单级目录
        if (!route.hidden) {
          newItems.push(
            getItem(
              route.meta?.link ? (
                <a href={route.meta?.link} target="_blank" rel="noopener noreferrer">
                  {route.meta?.title}
                </a>
              ) : (
                route.meta?.title
              ),
              route.path as string,
              <SvgIcon iconClass={route.meta?.icon as string} style={{ marginRight: 5 }} />,
              null,
              route.query,
            ),
          )
        }
      }
    })
    return newItems
  }

  const items: MenuItem[] = createMenuFn(toJS(dynamicRouters))

  //#region  点击 item 跳转路由 && 持久化 menu 选中
  const navigateFn: MenuProps['onClick'] = ({ key, item }) => {
    // 因为在统一路由生成的时候，所有path路径都在前面加了/
    const pattern = /^(\/http|\/https):\/\//

    const newItem = item as unknown as { props: { query: string } }
    let query = {}
    if (newItem.props.query) query = JSON.parse(newItem.props.query)

    // 路由跳转
    if (!pattern.test(key)) {
      navigate(key, { state: query })
    }

    changeSelectedKeys([key])
  }
  //#endregion

  // 监听当前路径变化
  useEffect(() => {
    // 当前路径 属于那一层目录
    setOpenKeys(
      directoryList.filter((item) => {
        return pathname.indexOf(item) !== -1
      }),
    )

    // 控制menu选中变色
    setSelectedKeys([pathname])
    changeSelectedKeys([pathname])
  }, [pathname])

  return (
    <Menu
      theme="light"
      mode="inline"
      onSelect={navigateFn}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      items={items}
    />
  )
}

export default MenuCom
