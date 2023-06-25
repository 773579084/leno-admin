// 定时任务调用的方法
const addEditFn = () => {
  console.log(3, new Date())
}

// 执行一次
const runOneFn = () => {
  console.log(8, '立即执行一次', new Date())
}

export default {
  addEditFn,
  runOneFn
}
