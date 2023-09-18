import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { IgetInfoType, userType } from '@/type';

export default class UseUserInfoStore {
  userInfo = {} as userType;

  roles = [] as string[];

  permissions = [] as string[];

  token = '' as string;

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // 响应式处理
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'lenoAdmin-token', // 存储到localStorage当中的key值是什么，此处为字符串string；
      properties: ['token'], // 需要持久化的数据是什么，此数据需要为上面声明了的变量，并且传值方式为[string]
      storage: window.localStorage, // 你的数据需要用那种方式存储，常见的就是localStorage
    });
  }

  setUserInfo = (data: IgetInfoType) => {
    this.userInfo = data.userInfo;
    this.roles = data.roles;
    this.permissions = data.permissions;
  };

  removeUserInfo = () => {
    this.userInfo = {};
    this.roles = [];
    this.permissions = [];
  };

  setProfile = (data: userType) => {
    this.userInfo = data;
  };

  setToken = (token: string) => {
    this.token = token;
  };

  removeLocalToken = (token: string) => {
    this.token = token;
  };
}
