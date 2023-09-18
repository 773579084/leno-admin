// 前端 类型文件
// 所有数据通用
export interface IdeptType {
  deptId?: number;
  parentId?: number;
  ancestors?: string;
  deptName?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  delFlag?: string;
  createBy?: string;
  updateBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IdeptType[];
  };
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number;
  message: string;
  result: IdeptType;
}

export interface ITreeType {
  deptId?: number;
  parentId?: number;
  ancestors?: string;
  deptName?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  delFlag?: string;
  createBy?: string;
  updateBy?: string;
  createdAt?: string;
  updatedAt?: string;
  children?: any[];
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
