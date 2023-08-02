/* 引入工具函数 */
import '@/assets/style/App.css'
import { AuthRouter } from '@/routes/utils/routers'
/* 全局 Loading */
import Loading from '@/components/Loading'
import { Router } from '@/routes/index'

const App = () => {
  return (
    <div style={{ height: 100 + '%' }}>
      {/* 注册路由 */}
      <AuthRouter>
        <Router />
      </AuthRouter>
      {/* 全局 Loaing */}
      <Loading />
    </div>
  )
}

export default App
