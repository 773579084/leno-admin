import Koa, { DefaultContext, DefaultState } from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import errHandlerFn from '../app/errHandler'

// 引入路由
import userRouter from '../router/user'

// 初始化 Koa 应用实例
const app: Koa<DefaultState, DefaultContext> = new Koa()

// 注册中间件
app.use(cors()) // 解决跨域问题
app.use(bodyParser()) // 请求体解析 仅仅解析 x-www-form-urlencoded 格式

// 路由
app.use(userRouter.routes())

// 统一错误处理
app.on('error', errHandlerFn)

export default app
