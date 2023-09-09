import { useState, useEffect, memo } from 'react'
import { Layout, Drawer } from 'antd'
const { Sider } = Layout
import classes from './index.module.scss'
import useStore from '@/store'
/* 组件 */
import MenuCom from './components/Menu'
import HeaderCom from './components/Header'
import ContentCom from './components/Content'
import TabsCom from './components/Tabs'
import { AliveScope } from 'react-activation'
import '@/assets/style/variables.scss'
import { observer } from 'mobx-react-lite'
import createSocket from '@/api/modules/socket'

const LayoutCom = () => {
  const {
    useGlobalStore: { siderStatus, changeSiderStatus },
    useLayoutStore: { layoutSet },
    useSocketStore: { setSocket },
  } = useStore()
  // control Sider
  const [collapsed, setCollapsed] = useState(siderStatus)
  // Drawer
  const [open, setOpen] = useState(false)
  // 控制menu菜单的展示状态
  const [sider996, setSider996] = useState(false)
  // 菜单是否展开
  const [expansion, setExpansion] = useState(false)

  useEffect(() => {
    // 初始化连接socket
    const socket = createSocket('wsNotice')
    setSocket(socket)

    listeningWindow()
    // 刷新页面时，判断侧边栏的状态
    let screenWidth = document.body.clientWidth
    if (screenWidth < 996) setSider996(true)
  }, [])

  // listen window size change
  const listeningWindow = () => {
    window.onresize = () => {
      return (() => {
        let screenWidth = document.body.clientWidth
        if (screenWidth < 996) {
          setSider996(true)
          setOpen(false)
          setExpansion(false)
        } else if (screenWidth < 1100) {
          setSider996(false)
          setCollapsed(true)
          setExpansion(true)
        }
      })()
    }
  }

  // sider 状态保持
  useEffect(() => {
    console.log(56, collapsed)
    let screenWidth = document.body.clientWidth
    if (screenWidth < 996) {
      collapsed ? setOpen(false) : setOpen(true)
    } else {
      collapsed ? setExpansion(collapsed) : setExpansion(collapsed)
    }

    if (collapsed !== siderStatus) changeSiderStatus(collapsed)
  }, [collapsed])

  const SiderCom = (
    <Sider theme="light" trigger={null} collapsible={true} collapsed={expansion}>
      <div hidden={!layoutSet.sidebarLogo} className={`${classes.logo} ${layoutSet.headerTheme}`}>
        <div className={classes['logo-image']}></div>
        {!collapsed && <div className={classes['logo-font']}>Leno Admin</div>}
      </div>
      <div className={classes['sider-menu']}>
        <MenuCom collapsed={collapsed} />
      </div>
    </Sider>
  )

  return (
    /**
     * 此处不要使用 layout 包裹整个 sider、header、content，会导致layout闪烁
     * 此处需要将 silder 与 header&&content 分开布置，可以解决闪烁问题
     */
    <div className={classes['layout-container']}>
      {sider996 ? (
        <Drawer
          closable={false}
          open={open}
          placement="left"
          onClose={() => {
            setCollapsed(true)
          }}
          width="200px"
          className={classes['sider-drawer']}
        >
          {SiderCom}
        </Drawer>
      ) : (
        SiderCom
      )}

      <Layout
        className={classes['site-layout']}
        style={layoutSet.fixedHeader ? {} : { overflow: 'auto' }}
      >
        <HeaderCom collapsed={collapsed} setCollapsed={setCollapsed} />
        <TabsCom />
        <AliveScope>
          <ContentCom />
        </AliveScope>
      </Layout>
    </div>
  )
}

export default memo(observer(LayoutCom))
