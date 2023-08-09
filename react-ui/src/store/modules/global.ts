import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

export default class useGlobalStore {
  isLoading: boolean = false // 控制全局loading效果
  isContentLoading: boolean = false // 控制content loading 效果
  globalLoadingTimeMobx: number = 0 // 控制全局loading显示时间
  siderStatus: boolean = false
  logout: boolean = true // 退出弹窗控制
  address: string = '' // 路径地址

  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {
      name: 'siderStatus',
      properties: ['siderStatus'],
      storage: window.localStorage,
    })
  }

  // change Loading
  changeIsLoading = (bol: boolean, num?: number) => {
    this.isLoading = bol
    num ? (this.globalLoadingTimeMobx = num) : null
  }

  // change Loading
  changeIsContentLoading = (bol: boolean) => {
    this.isContentLoading = bol
  }

  changeSiderStatus = (collapsed: boolean) => {
    this.siderStatus = collapsed
  }

  changeLogout = (bol: boolean) => {
    this.logout = bol
  }
}
