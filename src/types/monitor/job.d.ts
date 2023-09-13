/* global OpTypes */
// 后端 类型文件
export interface IjobQueryType {
  pageNum: number;
  pageSize: number;
  concurrent?: string;
  createdAt?: string;
  createBy?: string;
  cronExpression?: string;
  invokeTarget?: string;
  jobGroup?: string;
  jobId?: number;
  jobName?: string;
  misfirePolicy?: string;
  remark?: string;
  status?: string;
  updatedAt?: string;
  updateBy?: string;
  nextValidTime?: string;
}

export interface IjobQuerySerType {
  pageNum: number;
  pageSize: number;
  job_group?: { [OpTypes.eq]: string };
  job_name?: { [OpTypes.like]: string };
  status?: { [OpTypes.eq]: string };
}

export interface Ijob {
  concurrent?: string;
  cronExpression?: string;
  invokeTarget?: string;
  jobGroup?: string;
  jobName?: string;
  misfirePolicy?: string;
  status?: string;
}

export interface IjobSer {
  concurrent?: string;
  create_at?: string;
  create_by?: string;
  cron_expression?: string;
  invoke_target?: string;
  job_group?: string;
  job_id?: number;
  job_name?: string;
  misfire_policy?: string;
  remark?: string;
  status?: string;
  update_at?: string;
  update_by?: string;
}
