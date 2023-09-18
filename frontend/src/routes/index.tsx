import { useEffect, useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { HOME_URL } from '@/config/config';
import useStore from '@/store';
import { observer } from 'mobx-react-lite';
import { RouteType } from '@/type/modules/system/menu';
import { toJS } from 'mobx';

/* 主干路由页面 */
import Login from '@/views/login';
import Page404 from '@/views/errMessage/404';
import Page500 from '@/views/errMessage/500';
import Layout from '@/Layout';

/**
 * 路由配置项
 *
 * path:'路径'            // 路径，如果不是多级嵌套，可为 ' '
 * hidden:true           // 设置为true时不会出现在侧边栏
 * name:'router-name'     // 设定路由名，此项必填 (也是唯一标志名)
 * element:<login />     // 组件
 * perms: "profile:list"     // 权限字符
 * alwaysShow::true       // 设置该属性为true后，侧边栏就会出现多级嵌套，否则不会出现
 * meta:{
 *   title:'title'        // 设置该路由在侧边栏和面包屑的name
 *   link:'http'          // 外链地址
 *   noCache:false       // 是否缓存 true 缓存 false不缓存
 *   icon:'svg-name'      // 设置该路由的图标，对应路径 src/assets/icons/svg
 * }
 */

export const rootRouter = [
  // 所有的动态路由都将渲染到该主菜单上
  {
    element: <Layout />,
    children: [] as RouteType[],
  },
  {
    path: '/login',
    element: <Login />,
    meta: { title: '登录页' },
  },
  {
    path: '/404',
    element: <Page404 />,
    meta: { title: '404页面' },
  },
  {
    path: '/500',
    element: <Page500 />,
    meta: { title: '500页面' },
  },
  {
    path: '/',
    element: <Navigate to={HOME_URL} />,
  },
];

export const Router = observer(() => {
  const [route, setRoute] = useState(rootRouter);
  const {
    useRoutersStore: { dynamicRouters },
  } = useStore();

  useEffect(() => {
    rootRouter[0].children = toJS(dynamicRouters);
    setRoute([...rootRouter]);
  }, [dynamicRouters]);

  return useRoutes(route);
});
