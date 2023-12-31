import { InoticeType } from '@/type/modules/system/notice';
import { makeAutoObservable } from 'mobx';
import { Socket } from 'socket.io-client';

export default class UseUserInfoStore {
  socket = {} as Socket;

  notices = [] as InoticeType[];

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // 响应式处理
    makeAutoObservable(this);
  }

  setSocket = (data: Socket) => {
    this.socket = data;
  };

  removeSocket = () => {
    this.socket = {} as Socket;
  };

  setNotices = (data: InoticeType[]) => {
    this.notices = data;
  };
}
