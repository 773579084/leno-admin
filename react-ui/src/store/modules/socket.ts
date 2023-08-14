import { makeAutoObservable } from 'mobx'
import { Socket } from 'socket.io-client'

export default class useUserInfoStore {
  socket = {} as Socket

  constructor() {
    // 响应式处理
    makeAutoObservable(this)
  }

  setSocket = (data: Socket) => {
    this.socket = data
  }

  removeSocket = () => {
    this.socket = {} as Socket
  }
}
