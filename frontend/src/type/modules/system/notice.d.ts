// 前端 类型文件
// 所有数据通用

export interface InoticeDetailType {
  pageNum: number;
  pageSize: number;
  noticeId?: number;
  noticeTitle?: string;
  noticeType?: string;
  noticeContent?: string;
  status?: string;
  imgs?: string;
  createBy?: string;
  createdAt?: string;
  updateBy?: string;
  updatedAt?: string;
  remark?: string;
}
export interface InoticeType extends InoticeDetailType {
  pageNum: number;
  pageSize: number;
}

// 数据列表
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: InoticeType[];
  };
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number;
  message: string;
  result: InoticeType;
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
