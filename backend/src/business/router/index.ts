import Router from 'koa-router';
import fs from 'fs';

const router = new Router();

async function registerRouter(basePath: string) {
  const files = await fs.promises.readdir(basePath);

  for (const file of files) {
    const filePath = `${basePath}/${file}`;
    // eslint-disable-next-line no-await-in-loop
    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      await registerRouter(filePath); // 递归处理子目录
    } else if (stats.isFile() && !file.includes('index')) {
      // eslint-disable-next-line no-await-in-loop
      const { default: r } = await import(filePath); // 使用动态导入
      router.use(r.routes());
    } else {
      console.log('这是一个特殊的类型（不是文件也不是文件夹）');
    }
  }
}

registerRouter(__dirname);

export default router;
