// 后端 类型文件
export interface IjobLogQueryType {
  pageNum: number
  pageSize: number
  createAt?: string
  exceptionInfo?: string
  invokeTarget?: string
  jobGroup?: string
  jobLogId?: number
  jobMessage?: string
  jobName?: string
  status?: string
}

export interface IjobLogQuerySerType {
  pageNum: number
  pageSize: number
  job_group?: { [OpTypes.eq]: string }
  job_name?: { [OpTypes.like]: string }
  status?: { [OpTypes.eq]: string }
}

export interface IjobLog {}

export interface IjobLogSer {
  create_at?: string
  exception_info?: string
  invoke_target?: string
  job_group?: string
  job_log_id?: number
  job_message?: string
  job_name?: string
  status?: string
}
