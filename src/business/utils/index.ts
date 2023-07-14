import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import { dictMapListType, dictMapType } from '@/types'
import os from 'os'
import env from '@/config/default'
const { APP_PORT, APP_HTTP } = env()
import bcrypt from 'bcryptjs'

/** 删除文件
 * @param {string} filename
 * @return {boolean}
 */
export const removeSpecifyFile = (filename: string): boolean => {
  const filePath = path.join(__dirname, '../../../static')
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath + '/' + filename)
  } else {
    return false
  }
  return true
}

/**
 * 删除文件夹及文件内所有的文件夹及文件
 * @param folderPath
 */
export const removeFolder = (folderPath: string) => {
  // 查询文件夹下面的所有文件
  const files = fs.readdirSync(folderPath)

  for (let item of files) {
    const stats = fs.statSync(`${folderPath}/${item}`)
    // 检查是否为文件夹
    if (stats.isDirectory()) {
      // 为文件夹就递归
      removeFolder(`${folderPath}/${item}`)
    } else {
      // 为文件就用删除文件方式删除
      fs.unlinkSync(`${folderPath}/${item}`)
    }
  }
  // 文件夹内部文件删除完后，就用删除文件夹的方式删除文件夹
  fs.rmdirSync(folderPath)
}

/**
 * 删除文件夹 里面的所有文件
 * @param folderPath
 */
export const delFiles = (folderPath: string) => {
  const files = fs.readdirSync(folderPath)

  for (let item of files) {
    // 为文件就用删除文件方式删除
    fs.unlinkSync(`${folderPath}/${item}`)
  }
}

/** 返回数据下划线转化为驼峰命名
 * @param {data} 'obj或ary'
 * @param {type} 默认hump 'hump' 下划线转驼峰，'line' 驼峰转下划线
 * @return {Array||Object}
 */
export const formatHumpLineTransfer = (data, type = 'hump'): Array<any> => {
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
export const timeChange = (data: any[]): Array<any> => {
  // 判断传入的值是对象还是数组
  const newData =
    Object.prototype.toString.call(data) === '[object Object]'
      ? [JSON.parse(JSON.stringify(data))]
      : JSON.parse(JSON.stringify(data))

  function toggleFn(list: any[]) {
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
    newData.forEach((item: any) => (obj = item))
    return obj
  } else {
    return newData
  }
}

/**
 * 对象扁平化
 */
export const flatten = (obj: any) => {
  let result = {}

  let process = (key: string, value: string | any[]) => {
    // 首先判断是基础数据类型还是引用数据类型
    if (Object.prototype.toString.call(value) === '[object Object]') {
      let objArr = Object.keys(value)
      objArr.forEach((item) => {
        process(key ? `${key}.${item}` : `${item}`, value[item])
      })
      if (objArr.length === 0 && key) {
        result[key] = {}
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        process(`${key}[${i}]`, value[i])
      }
      if (value.length === 0) {
        result[key] = []
      }
    } else {
      // 基础数据类型
      if (key) {
        result[key] = value
      }
    }
  }
  process('', obj)
  return result
}

/**
 * 字典数据映射
 */
export const dictMapFn = (dicts: dictMapListType): dictMapType => {
  const maps = {} as dictMapType

  for (let key in dicts) {
    maps[key] = {}
    dicts[key].forEach((dict) => {
      maps[key][dict.dict_value] = dict.dict_label
    })
  }

  return maps
}

/**
 * 文件名转访问路径
 * @param filesName
 */
export const accessSrcFn = (filesName: string[]) => {
  const srcs = []
  const ip = os.networkInterfaces()['WLAN'][1].address
  filesName.forEach((fileName) => {
    srcs.push(`${APP_HTTP}://${ip}:${APP_PORT}/${fileName}`)
  })
  return srcs
}

/**
 * 下划线转首字母和下划线后首字母大写，并去掉下划线
 * @param str
 * @returns
 */
export const underlineToCamel = (str: string) => {
  return str
    .replace(/_(\w)/g, function (match, p1) {
      return p1.toUpperCase()
    })
    .replace(/^\w/, function (match) {
      return match.toUpperCase()
    })
}

/**
 * 下划线后首字母大写，并去掉下划线
 *  @param str
 */
export const underline = (str: string) => {
  return str.replace(/_(\w)/g, function (match, p1) {
    return p1.toUpperCase()
  })
}

/**
 * 生成随机的hash值
 * @param hashLength 生成hash值的长度
 */
export const createHash = (hashLength = 30) => {
  return Array.from(Array(Number(hashLength)), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('')
}

/**
 * 密码加密
 * @param newPwd
 * @returns
 */
export const pwdHash = (newPwd: string) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(newPwd, salt)
}
