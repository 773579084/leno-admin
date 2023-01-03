import fs from 'fs'
import path from 'path'

/** 删除文件
 * @param {string} filename
 * @return {boolean}
 */
export const removeSpecifyFile = (filename) => {
  const filePath = path.join(__dirname, '../upload')
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath + '/' + filename)
  } else {
    return false
  }
  return true
}

/** 返回数据下划线转化为驼峰命名
 * @param {object} obj
 * @param {data} obj或ary
 * @param {type} 'hump' 为下划线转驼峰，'line' 为驼峰转下划线
 * @return {object}
 */
export const formatHumpLineTransfer = (data, type = 'hump') => {
  // 判断传入的值是对象还是数组
  const newData =
    Object.prototype.toString.call(data) === '[object Object]'
      ? [JSON.parse(JSON.stringify(data))]
      : JSON.parse(JSON.stringify(data))

  function toggleFn(list) {
    list.forEach((item) => {
      for (const key in item) {
        // 下划线 转 驼峰
        if (type === 'hump') {
          const keyIndex = key.indexOf('_')
          if (keyIndex !== -1) {
            const letter = key[keyIndex + 1].toUpperCase()
            const newKey = key.split('')
            const newValue = item[key]
            newKey.splice(keyIndex, 2, letter)
            delete item[key]
            item[newKey.join('')] = newValue
          }
        }
        // 驼峰 转 下划线

        // 如果值为对象
        if (Object.prototype.toString.call(item[key]) === '[object Object]') {
          toggleFn([item[key]])
        }
        // 如果值为数组
        if (Object.prototype.toString.call(item[key]) === '[object Array]') {
          toggleFn(item[key])
        }
      }
    })
  }
  toggleFn(newData)

  console.log(37, newData)

  return newData
}
