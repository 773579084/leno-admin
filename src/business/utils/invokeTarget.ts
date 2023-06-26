// 测试 立即执行
const addEditFn = (a: string, b: string, c: string) => {
  console.log(2, a, b, c)

  try {
    console.log(3, new Date())
  } catch (error) {}
}

export default {
  addEditFn
}
