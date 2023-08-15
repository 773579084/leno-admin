import { useState, useEffect, memo } from 'react'
import { Layout } from 'antd'
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

  useEffect(() => {
    // 初始化连接socket
    const socket = createSocket('wsNotice')
    setSocket(socket)
  }, [])

  // listen window size change
  const listeningWindow = () => {
    window.onresize = () => {
      return (() => {
        let screenWidth = document.body.clientWidth
        if (!collapsed && screenWidth < 1200) setCollapsed(true)
        if (!collapsed && screenWidth > 1200) setCollapsed(false)
      })()
    }
  }

  // init mounted
  useEffect(() => {
    listeningWindow()
  }, [])

  // sider 状态保持
  useEffect(() => {
    if (collapsed !== siderStatus) changeSiderStatus(collapsed)
  }, [collapsed])

  return (
    /**
     * 此处不要使用 layout 包裹整个 sider、header、content，会导致layout闪烁
     * 此处需要将 silder 与 header&&content 分开布置，可以解决闪烁问题
     */
    <div className={classes['layout-container']}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div hidden={!layoutSet.sidebarLogo} className={`${classes.logo} ${layoutSet.headerTheme}`}>
          <div className={classes['logo-image']}></div>
          {!collapsed && <div className={classes['logo-font']}>Leno Admin</div>}
        </div>
        <div className={classes['sider-menu']}>
          <MenuCom collapsed={collapsed} />
        </div>
      </Sider>

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
