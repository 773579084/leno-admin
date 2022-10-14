'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const koa_1 = __importDefault(require('koa'))
const app = new koa_1.default()
app.use(async (ctx) => {
  ctx.body = 'coderlzw'
})
app.listen(3010, () => {
  console.log('服务器启动成功,running http://127.0.0.1:3010')
})
//# sourceMappingURL=main.js.map
