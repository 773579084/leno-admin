import { Context } from 'koa';
import axios from 'axios';
import dayjs from 'dayjs';
import fs from 'fs';
import { ImachineType } from '@/types/system/logininfor';
import SysLogininfor from '@/mysql/model/system/logininfor.model';
import { IuserTokenType } from '@/types/auth';
import SysOperLog from '@/mysql/model/system/operlog.model';
import { RouteType } from '@/types/system/system_menu';
import { IjobSer } from '@/types/monitor/job';
import MonitorJobLog from '@/mysql/model/monitor/jobLog.model';
import errors from '@/app/err.type';
import { logWhites } from '@/config';
import env from '@/config/default';
import { queryKeyValue } from './auth';
import { queryMenuMes } from './redis';
import { addSer } from '../service';

const { logErr } = errors;

/**
 * 获取请求的系统模块及操作类型
 * @param menus
 * @param ctx
 * @returns {title:string,business_type:string}
 */
export const filterModule = (menus: RouteType[], ctx: Context): { title: string; business_type: string } => {
  const urlList = ctx.request.url.split('/');
  let title = '';
  let business_type = '';
  const judgeElement = [];

  // 系统模块判断
  function forMenus(menuList: RouteType[]) {
    menuList.forEach((menu) => {
      if (menu.children) {
        forMenus(menu.children);
      } else {
        judgeElement.push({ element: menu.element, title: menu.meta.title });
      }
    });
  }
  forMenus(menus);
  // 判断请求请求路径与哪个element符合，赋值title
  const findObj = judgeElement.find((item) => ctx.request.url.indexOf(item.element) !== -1);
  findObj ? (title = findObj.title) : (title = '通用模块');

  // 操作类型
  const specialEvents = [
    {
      type: 'authorization',
      value: '4',
    },
    {
      type: 'export',
      value: '5',
    },
    {
      type: 'import',
      value: '6',
    },
    {
      type: 'logout',
      value: '7',
    },
    {
      type: 'tool',
      value: '8',
    },
    {
      type: 'clean',
      value: '9',
    },
  ];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < specialEvents.length; i++) {
    if (urlList.includes(specialEvents[i].type)) {
      return {
        title,
        business_type: specialEvents[i].value,
      };
    }
  }

  switch (ctx.request.method) {
    case 'POST':
      business_type = '1';
      break;
    case 'PUT':
      business_type = '2';
      break;
    case 'DELETE':
      business_type = '3';
      break;

    default:
      break;
  }

  return {
    title,
    business_type,
  };
};

/**
 * 用 ip 查询地址
 * @param ip
 */
export const queryIpAdress = async (ip: string) => {
  try {
    let address = '未知ip';

    // eslint-disable-next-line no-use-before-define
    if (!isIPAddress(ip)) {
      return address;
    }

    const { data } = await axios.get(`http://ip-api.com/json/${ip}?lang=zh-CN`);
    if (data.status === 'success') {
      address = `${data.regionName} ${data.city}`;
    }
    return address;
  } catch (error) {
    console.error(' ip 查询地址失败', error);
  }
};

/**
 * 获取访问用户的真是ip
 * @param ctx
 */
export const getUserIp = (ctx: Context) => {
  const ip = (ctx.request.headers['x-real-ip'] || ctx.request.ip) as string;
  return ip.split(':').slice(-1)[0];
};

/**
 * 判断是否为ip格式
 * @param ip
 * @returns
 */
function isIPAddress(ip: string): boolean {
  // 正则表达式匹配 IPv4 地址
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // 正则表达式匹配 IPv6 地址
  const ipv6Pattern =
    // eslint-disable-next-line max-len
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}$|^:(?::[0-9a-fA-F]{1,4}){1,7}$|^::$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

/**
 *
 * @param ctx koa请求信息
 * @returns {ip,address,browser,os}
 */
export const queryUserMachine = async (ctx: Context): Promise<ImachineType> => {
  // 用户 ip 及 地址
  const ip = getUserIp(ctx);
  const address = await queryIpAdress(ip);
  // 浏览器
  // eslint-disable-next-line no-underscore-dangle
  const browser = `${ctx.userAgent._agent.browser} ${ctx.userAgent._agent.version.split('.')[0]}`;
  // 操作系统
  // eslint-disable-next-line no-underscore-dangle
  const os = ctx.userAgent._agent.os.split('.')[0];

  return {
    ip,
    address,
    browser,
    os,
  };
};

/**
 * 写入 日志
 * @param type 登录状态 0 成功 1 失败
 * @param ctx koa请求信息
 * @param data 其他信息
 */
export const writeLog = async (type: string, ctx: Context, data?: { code: string | number; message: string }) => {
  try {
    const user = ctx.state.user as IuserTokenType;

    // 写入登录日志
    if (ctx.request.url.split('/').includes('login')) {
      const machine = await queryUserMachine(ctx);
      const loginLog = {
        user_name: type === '0' ? user.userName : ctx.request.body.userName,
        ipaddr: machine.ip,
        login_location: machine.address,
        browser: machine.browser,
        os: machine.os,
        status: type,
        msg: type === '0' ? '登录成功' : data.message,
        login_time: new Date().toLocaleString(env().LOG_TIME),
      };

      await addSer(SysLogininfor, loginLog);
    }

    // 写入操作日志
    if (!logWhites.includes(ctx.request.url) && ctx.request.method !== 'GET') {
      // 1 查询日志所属的 系统模块 操作类型
      const menus = await queryMenuMes();
      const { business_type, title } = filterModule(menus, ctx);

      // 2 查询 用户信息 拿去请求用户 设备信息
      if (user) {
        const userMes = await queryKeyValue(user.session);
        const operLog = {
          title,
          business_type,
          method: '',
          request_method: ctx.request.method,
          operator_type: '',
          oper_name: userMes.userInfo.userName,
          dept_name: userMes.userInfo.dept.deptName,
          oper_url: ctx.request.url,
          oper_ip: userMes.ip,
          oper_location: userMes.address,
          oper_param: JSON.stringify(ctx.request.body).length > 200 ? '上传数据超长，未存储到数据库' : JSON.stringify(ctx.request.body),
          json_result: JSON.stringify(data),
          status: type,
          error_msg: type === '1' ? data.message : '',
          oper_time: new Date().toLocaleString(env().LOG_TIME),
        };

        await addSer(SysOperLog, operLog);
      }
    }

    // 接口请求操作 终端打印
    console.log(
      type === '0' ? '\x1b[32m%s\x1b[0m' : '\x1b[31m%s\x1b[0m',
      `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [${type === '0' ? 'success' : 'error'}] [${env().APP_HOST}:${env().APP_PORT}] [${ctx.request.url}] ${data.message}`,
    );

    // 写入到文件中 （按每天日期写入）: pm2 下不开启写入log文件，由pm2生成log文件，如果不使用PM2，则开启此log日志文件写入
    //  writeFileLog(type, ctx, data)
  } catch (error) {
    console.error('写入日志失败', error);
    console.log('\x1b[31m%s\x1b[0m', `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [${type === '0' ? 'success' : 'error'}] [${env().APP_HOST}:${env().APP_PORT}] [${ctx.request.url}] 写入日志失败`);
  }
};

/**
 * 写入调度日志到数据库
 * @param job
 * @param type 登录状态 0 成功 1 失败
 * @param message 信息
 */
export const writeJobLog = async (ctx: Context, job: IjobSer, type: string, message?: string) => {
  try {
    const jobLog = {
      job_name: job.job_name,
      job_group: job.job_group,
      invoke_target: job.invoke_target,
      job_message: message,
      status: type,
      exception_info: type === '1' ? message : '',
    };
    await addSer(MonitorJobLog, jobLog);
  } catch (error) {
    console.error('写入调度日志到数据库失败', error);
    return ctx.app.emit('error', logErr, ctx);
  }
};

/**
 * 将日志 写道 /log文件夹中 以.log格式存储
 * @param type 登录状态 0 成功 1 失败
 * @param ctx koa请求信息
 * @param data 其他信息
 */
export const writeFileLog = (type: string, ctx: Context, data?: { code: string | number; message: string }) => {
  const currentTime = dayjs().format('YYYY-MM-DD');
  const fileName = `${__dirname.split('/')}../../log/${currentTime}.log`;
  const content = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [${type === '0' ? 'success' : 'error'}] [${env().APP_HOST}:${env().APP_PORT}] [${ctx.request.url}] ${data.message}\n`;

  // 写入文件
  if (fs.existsSync(fileName)) {
    fs.appendFileSync(fileName, content);
  } else {
    fs.writeFile(fileName, content, (err) => {
      if (err) throw err;
      console.log('文件已创建！');
    });
  }
};

/**
 * 获取路径
 * @param url
 * @param method 请求方法
 */
export const filterCtxUrl = (url: string, method: string) => {
  if (method === 'DELETE') {
    const urlList = url.split('/');
    urlList.splice(url.split('/').length - 1, 1);

    return urlList.join('/');
  }
  return url;
};
