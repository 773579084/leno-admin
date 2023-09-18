// 前端 类型文件
// 所有数据通用
export interface IlogininforType {
  pageNum: number;
  pageSize: number;
  infoId?: number;
  userName?: string;
  ipaddr?: string;
  loginLocation?: string;
  browser?: string;
  os?: string;
  status?: string;
  msg?: string;
  loginTime?: {
    beginTime: string;
    endTime: string;
  };
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IlogininforType[];
  };
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number;
  message: string;
  result: IlogininforType;
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
