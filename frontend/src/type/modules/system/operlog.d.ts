// 前端 类型文件
// 所有数据通用
export interface IoperlogDetailType {
  operId?: number;
  title?: string;
  businessType?: string;
  method?: string;
  requestMethod?: string;
  operatorType?: string;
  operName?: string;
  deptName?: string;
  operUrl?: string;
  operIp?: string;
  operLocation?: string;
  operParam?: string;
  jsonResult?: string;
  status?: string;
  errorMsg?: string;
  operTime?: string;
  consumptionTime?: string;
}

export interface IoperlogType extends IoperlogDetailType {
  pageNum: number;
  pageSize: number;
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IoperlogType[];
  };
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number;
  message: string;
  result: IoperlogType;
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
