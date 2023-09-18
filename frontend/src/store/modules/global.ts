import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export default class UseGlobalStore {
  isLoading = false; // 控制全局loading效果

  isContentLoading = false; // 控制content loading 效果

  globalLoadingTimeMobx = 0; // 控制全局loading显示时间

  siderStatus = false;

  logout = true; // 退出弹窗控制

  address = ''; // 路径地址

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'siderStatus',
      properties: ['siderStatus'],
      storage: window.localStorage,
    });
  }

  // change Loading
  changeIsLoading = (bol: boolean, num?: number) => {
    this.isLoading = bol;
    if (num) this.globalLoadingTimeMobx = num;
  };

  // change Loading
  changeIsContentLoading = (bol: boolean) => {
    this.isContentLoading = bol;
  };

  changeSiderStatus = (collapsed: boolean) => {
    this.siderStatus = collapsed;
  };

  changeLogout = (bol: boolean) => {
    this.logout = bol;
  };
}
