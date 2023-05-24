
// 前端 类型文件
// 所有数据通用
export interface IuserType {
  pageNum?: number
  pageSize?: number
  user_id?: number
    dept_id?: number
    user_name?: string
    nick_name?: string
    user_type?: string
    email?: string
    phonenumber?: string
    sex?: string
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

export interface ITreeType {
      user_id?: number
    dept_id?: number
    user_name?: string
    nick_name?: string
    user_type?: string
    email?: string
    phonenumber?: string
    sex?: string
    
      children?: any[]
    }

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number
  message: string
  result?: null
}