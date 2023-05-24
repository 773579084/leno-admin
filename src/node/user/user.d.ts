
  // 后端 类型文件
  export interface IuserQueryType {
    pageNum: number
    pageSize: number
    userId?: {
      beginTime: number
      endTime: number
    }
   deptId?: number
userName?: string
nickName?: string
}

  export interface IuserQuerySerType {
    pageNum: number
    pageSize: number
    user_id?: { [OpTypes.between]: string }
   dept_id?: { [OpTypes.like]: string }
   user_name?: { [OpTypes.eq]: string }
   nick_name?: { [OpTypes.eq]: string }
   }

  export interface Iuser {
    userId?: number
    deptId?: number
    userName?: string
    nickName?: string
    userType?: string
    email?: string
    phonenumber?: string
    sex?: string
    }

  export interface IuserSer {
    user_id?: number
    dept_id?: number
    user_name?: string
    nick_name?: string
    user_type?: string
    email?: string
    phonenumber?: string
    sex?: string
    }