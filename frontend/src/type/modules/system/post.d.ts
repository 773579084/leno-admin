// 前端 类型文件
// 所有数据通用
export interface IpostType {
  pageNum: number;
  pageSize: number;
  postId?: number;
  postCode?: string;
  postName?: string;
  postSort?: number;
  status?: string;
  delFlag?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: IpostType[];
  };
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number;
  message: string;
  result: IpostType;
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
