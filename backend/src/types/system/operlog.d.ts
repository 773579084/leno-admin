/* global OpTypes */
// 后端 类型文件
export interface IoperlogQueryType {
  pageNum: number;
  pageSize: number;
  operId?: number;
  title?: string;
  businessType?: string;
  method?: string;
  requestMethod?: string;
  operatorType?: string;
  operName?: string;
  deptName?: string;
  operUrl?: string;
  operIp?: string;
  operLocation?: string;
  operParam?: string;
  jsonResult?: string;
  status?: string;
  errorMsg?: string;
  operTime?: {
    beginTime: string;
    endTime: string;
  };
}

export interface IoperlogQuerySerType {
  pageNum: number;
  pageSize: number;
  title?: { [OpTypes.like]: string };
  business_type?: { [OpTypes.eq]: string };
  oper_name?: { [OpTypes.eq]: string };
  status?: { [OpTypes.eq]: string };
  oper_time?: { [OpTypes.eq]: string };
}

export interface IoperlogSer {
  oper_id?: number;
  title?: string;
  business_type?: number;
  method?: string;
  request_method?: string;
  operator_type?: number;
  oper_name?: string;
  dept_name?: string;
  oper_url?: string;
  oper_ip?: string;
  oper_location?: string;
  oper_param?: string;
  json_result?: string;
  status?: number;
  error_msg?: string;
  oper_time?: string;
}
