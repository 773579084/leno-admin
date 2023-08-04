// 前端 类型文件
// 所有数据通用
export interface InoticeType {
  pageNum?: number
  pageSize?: number
  noticeId?: number
  noticeTitle?: string
  noticeType?: string
  noticeContent?: string
  status?: string
  imgs?: string
  createBy?: string
  createdAt?: string
  updateBy?: string
  updatedAt?: string
  remark?: string
}

// 数据列表
export interface IgetListAPI {
  code: number
  message: string
  result: {
    count: number
    rows: InoticeType[]
  }
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number
  message: string
  result: InoticeType
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number
  message: string
  result?: null
}

// 用通知id 获取部门
export interface IgetDeptsAPI {
  code: number
  message: string
  result: string[]
}

// 新增通知部门关系
export interface IaddNoticeDeptType {
  noticeId: string
  deptIds: string[]
}

// 用部门id 获取通知内容（其他模块使用）
export interface IgetNoticeContentAPI {
  code: number
  message: string
  result: string[]
}
