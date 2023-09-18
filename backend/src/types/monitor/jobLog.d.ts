/* global OpTypes */
// 后端 类型文件
export interface IjobLogQueryType {
  pageNum: number;
  pageSize: number;
  createdAt?: {
    beginTime: string;
    endTime: string;
  };
  exceptionInfo?: string;
  invokeTarget?: string;
  jobGroup?: string;
  jobLogId?: number;
  jobMessage?: string;
  jobName?: string;
  status?: string;
}

export interface IjobLogQuerySerType {
  pageNum: number;
  pageSize: number;
  job_group?: { [OpTypes.eq]: string };
  job_name?: { [OpTypes.like]: string };
  status?: { [OpTypes.eq]: string };
  created_at?: { [OpTypes.between]: string };
}

export interface IjobLogSer {
  created_at?: string;
  exception_info?: string;
  invoke_target?: string;
  job_group?: string;
  job_log_id?: number;
  job_message?: string;
  job_name?: string;
  status?: string;
}
