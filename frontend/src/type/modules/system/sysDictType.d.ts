// 字典类型列表
export interface dictTableType {
  dictId: number;
  dictName: string;
  dictType: string;
  status: string;
  remark: string;
  createAt?: string;
}

// 查询字典类型列表
export interface ILimitAPI {
  pageNum: number;
  pageSize: number;
  dictName?: string;
  status?: string;
  beginTime?: string;
  endTime?: string;
  dictType?: string;
}

export interface IdictDataType {
  dictId?: number;
  dictName?: string;
  dictType?: string;
  status?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 新增，修改，删除 成功返回 字典类型
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}

// 新增(修改)字典类型
export interface addType {
  dictId?: number;
  dictName?: string;
  dictType?: string;
  status?: string;
  remark?: string;
}

// 获取字典类型详细数据
export interface IgetTypeAPI {
  code: number;
  message: string;
  result: IdictDataType;
}

export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IdictDataType[];
  };
}
export interface IgetOptionselecAPI {
  code: number;
  message: string;
  result: IdictDataType[];
}
