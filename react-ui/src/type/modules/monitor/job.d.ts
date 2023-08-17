// 前端 类型文件
// 所有数据通用
export interface IjobType extends IjobDetailType {
  pageNum: number
  pageSize: number
}

export interface IjobDetailType {
  concurrent?: string
  createdAt?: string
  createBy?: string
  cronExpression?: string
  invokeTarget?: string
  jobGroup?: string
  jobId?: number
  jobName?: string
  misfirePolicy?: string
  remark?: string
  status?: string
  updatedAt?: string
  updateBy?: string
  nextValidTime?: string
}

// 数据列表
export interface IgetListAPI {
  code: number
  message: string
  result: {
    count: number
    rows: IjobDetailType[]
  }
}

// 获取详细数据
export interface IgetDetailTypeAPI {
  code: number
  message: string
  result: IjobDetailType
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number
  message: string
  result?: null
}

// cron ref
export interface IcronComeType {
  refGetCron: Function
  resetCronState: Function
}
