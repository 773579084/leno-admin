import { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { useAliveController } from 'react-activation';
import ContentLoading from '@/components/ContentLoading';
import { observer } from 'mobx-react-lite';
import useStore from '@/store';
import { toJS } from 'mobx';
import classes from './index.module.scss';

const { Content } = Layout;

const ContentCom = () => {
  const {
    useLayoutStore: {
      layoutSet,
      defaultObjMobx: { tabsListMobx },
    },
  } = useStore();
  const { drop, getCachingNodes } = useAliveController();
  const { pathname } = useLocation();

  useEffect(() => {
    // 拿缓存的路由 与 tabs对比，过滤出缓存了但不在tabs中的路由进行去除缓存
    getCachingNodes().forEach((item) => {
      if (!toJS(tabsListMobx).find((tab) => tab.path === item.name)) drop(item.name as string);
    });
  }, [tabsListMobx]);

  return (
    <Content id="content" className={classes['site-layout-background']} style={layoutSet.fixedHeader ? { overflow: 'auto' } : {}} key={pathname}>
      <Outlet />

      {/* 内容展示区的laoding */}
      <ContentLoading />
    </Content>
  );
};
export default observer(ContentCom);
