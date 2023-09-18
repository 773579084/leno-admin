/* global OpTypes */
// 后端 类型文件
export interface IlogininforQueryType {
  pageNum: number;
  pageSize: number;
  infoId?: number;
  userName?: string;
  ipaddr?: string;
  loginLocation?: string;
  browser?: string;
  status?: string;
  os?: string;
  loginTimestatus?: string;
  msg?: string;
  loginTime?: {
    beginTime: string;
    endTime: string;
  };
}

export interface IlogininforQuerySerType {
  pageNum: number;
  pageSize: number;
  user_name?: { [OpTypes.like]: string };
  ipaddr?: { [OpTypes.like]: string };
  status?: { [OpTypes.eq]: string };
  login_time?: { [OpTypes.between]: string };
}

export interface IlogininforSer {
  info_id?: number;
  user_name?: string;
  ipaddr?: string;
  login_location?: string;
  browser?: string;
  os?: string;
  status?: string;
  msg?: string;
  login_time?: string;
}

// 请求用户设备信息
export interface ImachineType {
  ip: string;
  address: string;
  browser: string;
  os: string;
}
