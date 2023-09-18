import { makeAutoObservable } from 'mobx';
import { IDefaultObj, IlayoutSetType, IsetLayoutSetType, ITab } from '@/type';
import { HOME_URL } from '@/config/config';
// import { makePersistable } from 'mobx-persist-store' // 引入makePersistable方法进行持久化存储

export default class UseLayoutStore {
  defaultObjMobx: IDefaultObj = {
    selectedKeysMobx: [HOME_URL],
    breadcrumbListMobx: ['首页'],
    tabsListMobx: [{ path: HOME_URL, title: '首页' }],
  };

  layoutSet: IlayoutSetType = {
    headerTheme: 'darkBlue',
    theme: '#1890ff',
    tagsView: true,
    fixedHeader: true,
    sidebarLogo: true,
    dynamicTitle: false,
  };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    makeAutoObservable(this);
  }

  // change tabsListMobx
  changeTabsListMobx = (newTabs: ITab[]) => {
    this.defaultObjMobx.tabsListMobx = newTabs;
  };

  // change defaultSelectedMobx
  changeSelectedKeys = (pathArr: string[]) => {
    this.defaultObjMobx.selectedKeysMobx = pathArr;
  };

  // change breadcrumbListMobx
  changeBreadCrumbListFn = (breadArr: string[]) => {
    this.defaultObjMobx.breadcrumbListMobx = breadArr;
  };

  setLayoutSet = (obj: IsetLayoutSetType) => {
    this.layoutSet = {
      ...this.layoutSet,
      ...obj,
    };
  };
}
