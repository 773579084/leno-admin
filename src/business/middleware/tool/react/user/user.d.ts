
// 前端 类型文件
// 所有数据通用
export interface IuserType {
  pageNum?: number
  pageSize?: number
    userId?: number
  deptId?: number
  userName?: string
  nickName?: string
  userType?: string
  email?: string
  phonenumber?: string
  sex?: string
  avatar?: string
  password?: string
  status?: string
  delFlag?: number
  loginIp?: string
  loginDate?: string
  createBy?: string
  updateBy?: string
  remark?: string
  createdAt?: string
  updatedAt?: string
}

// 数据列表
export interface IgetListAPI {
  code: number
  message: string
  result: {
    count: number
    rows: IuserType[]
  }
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number
  message: string
  result: IuserType
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number
  message: string
  result?: null
}