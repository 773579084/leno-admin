import { makeAutoObservable } from 'mobx'

export default class useUserInfoStore {
  noticeList = []

  constructor() {
    // 响应式处理
    makeAutoObservable(this)
  }

  setNoticeList = (data: any) => {
    this.noticeList = data
  }

  removeNoticeList = () => {
    this.noticeList = []
  }
}
