import { BrowserRouter, HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from '@/App'
import '@/assets/icons'
import ReactDOM from 'react-dom'

// 配置 ant-design 中文版
import zhCN from 'antd/lib/locale/zh_CN'
import '@/assets/style/index.scss'

const root = document.getElementById('root')

if (root) {
  /**此处使用 react18之前的渲染方式，是因为路由缓存组件 react-activation 如果使用 createRoot 渲染会造成黑色频闪问题 */
  ReactDOM.render(
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>,
    root,
  )
}
