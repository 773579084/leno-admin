import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'

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
 * @param {data} 'obj或ary'
 * @param {type} 'hump' 为下划线转驼峰，'line' 为驼峰转下划线
 * @return {Array||Object}
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
        // 如果值为对象
        if (Object.prototype.toString.call(item[key]) === '[object Object]') {
          toggleFn([item[key]])
        }
        // 如果值为数组
        else if (Object.prototype.toString.call(item[key]) === '[object Array]') {
          toggleFn(item[key])
        }
        // 下划线 转 驼峰
        else if (type === 'hump') {
          const keyArr = key.split('_')
          let str = ''
          if (keyArr.length > 1) {
            keyArr.forEach((item, index) => {
              if (item) {
                if (index) {
                  const arr = item.split('')
                  arr[0] = arr[0].toUpperCase()
                  str += arr.join('')
                } else {
                  str += item
                }
              }
              if (!item) {
                keyArr.splice(0, 1)
              }
            })
            const newValue = item[key]
            delete item[key]
            item[str] = newValue
          }
        }
        // 驼峰 转 下划线
        else if (type === 'line') {
          const regexp = /^[A-Z]+$/
          const newKey = key.split('')
          const newValue = item[key]
          newKey.forEach((item2, index2) => {
            if (regexp.test(item2)) {
              newKey[index2] = '_' + item2.toLowerCase()
            }
          })
          delete item[key]
          item[newKey.join('')] = newValue
        }
      }
    })
  }
  toggleFn(newData)
  // 因为上面操作为了方便操作，会将对象转化为数组格式，操作完后，需要将原先是对象的重新转化为对象
  if (Object.prototype.toString.call(data) === '[object Object]') {
    let obj = null
    newData.forEach((item) => (obj = item))
    return obj
  } else {
    return newData
  }
}

/** 返回数据时间命名修改
 * @param {data} 'obj或ary'
 * @param {type}
 * @return {Array||Object}
 */
export const timeChange = (data) => {
  // 判断传入的值是对象还是数组
  const newData =
    Object.prototype.toString.call(data) === '[object Object]'
      ? [JSON.parse(JSON.stringify(data))]
      : JSON.parse(JSON.stringify(data))

  function toggleFn(list) {
    list.forEach((item) => {
      for (const key in item) {
        // 如果 item[key] 为时间，则修改时间格式重新赋值
        if (
          /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(
            item[key]
          )
        ) {
          item[key] = dayjs(item[key]).format('YYYY:MM:DD hh:mm:ss')
        }
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
  // 因为上面操作为了方便操作，会将对象转化为数组格式，操作完后，需要将原先是对象的重新转化为对象
  if (Object.prototype.toString.call(data) === '[object Object]') {
    let obj = null
    newData.forEach((item) => (obj = item))
    return obj
  } else {
    return newData
  }
}
