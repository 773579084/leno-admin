import { makeAutoObservable } from 'mobx'
import { IgetInfoType, userType } from '@/type'

export default class useUserInfoStore {
  userInfo = {} as userType
  roles = [] as string[]
  permissions = [] as string[]

  constructor() {
    // 响应式处理
    makeAutoObservable(this)
  }

  // 存储 userinfo
  setUserInfo = (data: IgetInfoType) => {
    this.userInfo = data.userInfo
    this.roles = data.roles
    this.permissions = data.permissions
  }

  // 存储 profile
  setProfile = (data: userType) => {
    this.userInfo = data
  }

  // 删除 userInfo
  removeUserInfo = () => {
    this.userInfo = {}
    this.roles = []
    this.permissions = []
  }
}
