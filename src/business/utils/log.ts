import { Context } from 'koa'
import axios from 'axios'
import { ImachineType } from '@/types/system/logininfor'
import { userType } from '@/types/user'
import { addSer } from '../service'
import SysLogininfor from '@/mysql/model/system/logininfor.model'

/**
 * 写入日志
 * @param type 登录状态 0 成功 1 失败
 * @param ctx koa请求信息
 * @param data 其他信息
 */
export const writeLog = async (type: string, ctx: Context, data?: any) => {
  const user = ctx.state.user as userType
  if (ctx.request.url.indexOf('login') !== -1) {
    const machine = await queryUserMachine(ctx)
    // 写入登录日志
    const loginLog = {
      user_name: user.userName,
      ipaddr: machine.ip,
      login_location: machine.address,
      browser: machine.browser,
      os: machine.os,
      status: type,
      msg: type === '0' ? '登录成功' : '',
      login_time: new Date()
    }
    console.log(27, loginLog)
    await addSer(SysLogininfor, loginLog)
  } else {
  }
}

/**
 *
 * @param ctx koa请求信息
 * @returns {ip,address,browser,os}
 */
export const queryUserMachine = async (ctx: Context): Promise<ImachineType> => {
  // 用户 ip 及 地址
  const ip = ctx.request.header.origin.split('//')[1].split(':')[0]
  const address = await queryIpAdress(ip)
  // 浏览器
  const browser = ctx.userAgent._agent.browser + ' ' + ctx.userAgent._agent.version.split('.')[0]
  // 操作系统
  const os = ctx.userAgent._agent.os.split('.')[0]

  return {
    ip,
    address,
    browser,
    os
  }
}

/**
 * 用 ip 查询地址
 * @param ip
 */
export const queryIpAdress = async (ip: string) => {
  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}?lang=zh-CN`)

    let address = ''
    if (data.status === 'success') {
      address = `${data.regionName} ${data.city}`
    } else {
      address = data.message
    }
    return address
  } catch (error) {
    console.error(' ip 查询地址失败', error)
  }
}
