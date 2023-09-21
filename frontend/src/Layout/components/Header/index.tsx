import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, GithubOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Layout, Tooltip } from 'antd';
import { PropsType } from '@/type';
import ScreenFull from '@/components/ScreenFull';
import useStore from '@/store';
import classes from './index.module.scss';
import AvatarCom from './components/AvatarCom';
import BreadcrumbCom from './components/Breadcrumb';
import NoticeCom from './components/NoticeCom';
import '@/assets/style/variables.scss';

const { Header } = Layout;

const HeaderCom: React.FC<PropsType> = ({ collapsed, setCollapsed }) => {
  const {
    useLayoutStore: { layoutSet },
  } = useStore();

  return (
    <div className={`${classes['site-layout-background']}`}>
      <Header style={{ padding: 0 }} className={layoutSet.headerTheme}>
        <div className={classes['header-left']}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <BreadcrumbCom />
        </div>

        <div className={classes['header-right']}>
          <ScreenFull />
          <NoticeCom />
          <Tooltip title="源码地址">
            <GithubOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => window.open('https://gitee.com/zhao-wenchao110/leno_-admin', '_blank')} />
          </Tooltip>
          <Tooltip title="文档地址">
            <QuestionCircleOutlined onClick={() => window.open('http://zhao-wenchao110.gitee.io/lenoadmin-docs', '_blank')} style={{ fontSize: 18, cursor: 'pointer' }} />
          </Tooltip>

          <AvatarCom />
        </div>
      </Header>
    </div>
  );
};
export default HeaderCom;
