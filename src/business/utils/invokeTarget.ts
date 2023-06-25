// 定时任务调用的方法
const addEditFn = () => {
  try {
    console.log(3, new Date())
  } catch (error) {}
}

// 执行一次
const runOneFn = () => {
  try {
    console.log(8, '立即执行一次', new Date())
  } catch (error) {}
}

export default {
  addEditFn,
  runOneFn
}
