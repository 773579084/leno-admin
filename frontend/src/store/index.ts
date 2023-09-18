import UseUserStore from './modules/user';
import UseGlobalStore from './modules/global';
import UseLayoutStore from './modules/layout';
import UseRoutersStore from './modules/permission';
import UseSocketStore from './modules/socket';

class RootStore {
  useUserStore: UseUserStore;

  useGlobalStore: UseGlobalStore;

  useLayoutStore: UseLayoutStore;

  useRoutersStore: UseRoutersStore;

  useSocketStore: UseSocketStore;

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // 对引入进行来的子模块进行实例化操作，并挂载到RootStore上
    this.useUserStore = new UseUserStore();
    this.useGlobalStore = new UseGlobalStore();
    this.useLayoutStore = new UseLayoutStore();
    this.useRoutersStore = new UseRoutersStore();
    this.useSocketStore = new UseSocketStore();
  }
}

// 实例化操作
const rootStore = new RootStore();
const useStore = () => rootStore;

export default useStore;
