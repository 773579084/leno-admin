import { Context } from 'koa';
import os from 'os';
import diskInfo from 'als-diskinfo';
import { IserverType } from '@/types/monitor/server';
import errors from '@/app/err.type';
import { getIpAddress } from '@/business/utils/server';

const { getListErr } = errors;

// 获取列表
export default async (ctx: Context, next: () => Promise<void>) => {
  try {
    const data = { cpu: {}, mem: {}, sys: {}, sysFiles: [] } as IserverType;

    const cpus = os.cpus();
    // cpu核心数
    data.cpu.cpuNum = cpus.length;
    // cpu 使用总和
    let total = 0;
    let sys = 0;
    let user = 0;
    let free = 0;
    let wait = 0;
    cpus.forEach((cpu) => {
      total += cpu.times.idle + cpu.times.irq + cpu.times.nice + cpu.times.sys + cpu.times.user;
      sys += cpu.times.sys;
      user += cpu.times.user;
      free += cpu.times.idle;
      wait += cpu.times.irq;
    });

    // cpu的系统使用率
    data.cpu.sys = Number(((sys / total) * 100).toFixed(2));
    // cpu的用户使用率
    data.cpu.used = Number(((user / total) * 100).toFixed(2));
    // 查 cpu 空置率
    data.cpu.free = Number(((free / total) * 100).toFixed(2));
    // 中断率
    data.cpu.wait = Number(((wait / total) * 100).toFixed(2));
    // 总共
    data.cpu.total = total;

    // 获取总内存大小
    const totalMemory = os.totalmem();

    data.mem.total = Number((totalMemory / 1024 / 1024 / 1024).toFixed(2));

    // 剩余内存
    data.mem.free = Number((os.freemem() / 1024 / 1024 / 1024).toFixed(2));
    // 已用内存
    data.mem.used = Number((data.mem.total - data.mem.free).toFixed(2));
    // 使用率
    data.mem.usage = Number(((data.mem.used / data.mem.total) * 100).toFixed(2));

    // 服务器名称
    data.sys.computerName = os.hostname();
    // 服务器IP
    data.sys.computerIp = getIpAddress();
    // 操作系统
    data.sys.osName = os.type();
    // 系统架构
    data.sys.osArch = os.arch();

    // 获取根目录的磁盘信息
    const res = (await diskInfo()) as any[];
    const newRes = res.map((item) => {
      const size = item.size / 1024 / 1024;
      const used = item.used / 1024 / 1024;
      return {
        typeName: item.Description,
        sysTypeName: item.VolumeSerialNumber,
        free: (item.free / 1024 / 1024).toFixed(2),
        dirName: item.name,
        total: size.toFixed(2),
        used: used.toFixed(2),
        usage: ((used / size) * 100).toFixed(2),
      };
    });
    data.sysFiles = newRes;
    ctx.state.formatData = data;
    await next();
  } catch (error) {
    console.error('查询列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};
