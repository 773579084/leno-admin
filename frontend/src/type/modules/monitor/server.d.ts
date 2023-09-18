// 前端 类型文件
export interface Cpu {
  cpuNum: number;
  total: number;
  sys: number;
  used: number;
  wait: number;
  free: number;
}

export interface Mem {
  total: number;
  used: number;
  free: number;
  usage: number;
}

export interface Jvm {
  total: number;
  max: number;
  free: number;
  version: string;
  home: string;
  startTime: string;
  runTime: string;
  inputArgs: string;
  usage: number;
  used: number;
  name: string;
}

export interface Sy {
  computerName: string;
  computerIp: string;
  userDir: string;
  osName: string;
  osArch: string;
}

export interface SysFile {
  dirName: string;
  sysTypeName: string;
  typeName: string;
  total: string;
  free: string;
  used: string;
  usage: string;
}

export interface IserverType {
  cpu: Cpu;
  mem: Mem;
  sys: Sy;
  sysFiles: SysFile[];
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: IserverType;
}
