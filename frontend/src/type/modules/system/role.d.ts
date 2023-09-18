/* eslint-disable no-undef */
// 前端 类型文件
// 所有数据通用
export interface IroleType {
  pageNum: number;
  pageSize: number;
  roleId?: number;
  roleName?: string;
  roleKey?: string;
  roleSort?: number;
  dataScope?: string;
  status?: string;
  delFlag?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  menuIds?: React.Key[];
  createdAt?: {
    beginTime: string;
    endTime: string;
  };
  updatedAt?: string;
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IroleType[];
  };
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number;
  message: string;
  result: IroleType;
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
