// 前端 类型文件
// 所有数据通用
export interface IjobLogType {
  pageNum?: number;
  pageSize?: number;
  createAt?: string;
  exceptionInfo?: string;
  invokeTarget?: string;
  jobGroup?: string;
  jobLogId?: number;
  jobMessage?: string;
  jobName?: string;
  status?: string;
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IjobLogType[];
  };
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number;
  message: string;
  result: IjobLogType;
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
