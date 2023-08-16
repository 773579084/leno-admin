// 前端 类型文件
// 所有数据通用
export interface IonlineType {
  pageNum: number
  pageSize: number
  browser?: string
  userName?: string
  ipaddr?: string
  deptName?: string
  loginLocation?: string
  loginTime?: string
  os?: string
  tokenId?: string
}

// 数据列表
export interface IgetListAPI {
  code: number
  message: string
  result: {
    count: number
    rows: IonlineType[]
  }
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number
  message: string
  result?: null
}
