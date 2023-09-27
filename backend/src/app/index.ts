import Koa from 'koa';
import cors from '@koa/cors';
import KoaBody from 'koa-body';
import path from 'path';
import koaStatic from 'koa-static';
import userAgent from 'koa-useragent';
import { createServer } from 'http';
import { Server } from 'socket.io'; // 引入 socket.io 模块

// 引入路由
import router from '@/business/router';
import { auth } from '@/business/middleware/common/auth';
import stopEdit from '@/business/middleware/common/stop_edit';
import initDB from '@/mysql/db';

import { wsNotice } from '@/business/utils/socket';
import errHandlerFn from './errHandler';
// 初始化 Koa 应用实例
const app = new Koa();

// 初始化 数据库配置项
initDB();

// 注册中间件
// 解决跨域问题
app.use(cors());

app.use(
  KoaBody({
    multipart: true, // 开启文件上传
    formidable: {
      // 文件上传的详细配置
      // 在配制选项option里, 不推荐使用相对路径
      // 在option里的相对路径, 不是相对的当前文件. 相对process.cwd()
      uploadDir: path.join(__dirname, '../../uploads'), // 上传的文件放置到哪个路径下
      maxFileSize: 1000 * 1024 * 1024, // 设置上传文件大小最大限制
      keepExtensions: true, // 是否保留文件的扩展名
    },
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  }),
);

// 配置静态资源网址访问
app.use(koaStatic(path.join(__dirname, '../../')));

// 统一权限判断
app.use(auth);

// 禁止操作修改删除类接口（此功能仅用于上线网页预览使用）
app.use(stopEdit);

// 获取请求用户的 设备信息
app.use(userAgent);

// 路由
app.use(router.routes()).use(router.allowedMethods());

// 统一错误处理
app.on('error', errHandlerFn);

// 创建 Socket.IO 实例并绑定到 HTTP 服务器
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// 在koa2应用中定义各种Socket.IO事件监听和处理
io.of('/wsNotice').on('connection', (socket) => wsNotice(socket));

export default httpServer;
