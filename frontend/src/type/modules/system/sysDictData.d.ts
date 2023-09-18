// 字典类型列表
export interface dictTableType {
  dictCode?: number;
  dictName?: string;
  dictSort?: number;
  dictLabel?: string;
  dictValue?: string;
  dictType?: string;
  cssClass?: string;
  listClass?: string;
  isDefault?: string;
  status?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 查询字典类型列表
export interface ILimitAPI {
  pageNum: number;
  pageSize: number;
  dictLabel?: string;
  dictType?: string;
  status?: string;
}

export interface IdictType {
  dictCode?: number;
  dictName?: string;
  dictSort?: number;
  dictLabel: string;
  dictValue: string;
  dictType?: string;
  cssClass?: string;
  listClass?: string;
  isDefault?: string;
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
  dictCode?: number;
  dictSort?: number;
  dictLabel?: string;
  dictValue?: string;
  dictType?: string;
  cssClass?: string;
  listClass?: string;
  status?: string;
  remark?: string;
}

// 获取字典类型详细数据
export interface IgetTypeAPI {
  code: number;
  message: string;
  result: IdictType[];
}
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IdictType[];
  };
}
