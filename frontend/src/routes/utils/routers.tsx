import { useLocation, Navigate } from 'react-router-dom';
import { getRoutersAPI, getUserAPI } from '@/api/modules/user';
import { IgetInfoType } from '@/type';
// mobx
import useStore from '@/store';
import { getToken } from '@/utils/auth';
import { RouteType } from '@/type/modules/system/menu';

/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
// 设置白名单
const whitePaths = ['/login', '/register', '/404', '/500'];
// 路由守卫配置函数
export const AuthRouter: any = (props: { children: RouteType }) => {
  const { pathname } = useLocation();
  const {
    useUserStore: { setUserInfo, userInfo, token, setToken },
    useRoutersStore: { setRouters },
  } = useStore();

  // 第一步 判断有无 token
  if (getToken()) {
    if (!token) setToken(getToken());

    // 第二步 判断是否前往login页面，等于跳转 '/', 不等于则继续判断
    if (pathname === '/login') {
      return <Navigate to="/" replace />;
    }
    // 第三步 判断是否拿到用户个人信息、路由、权限，没拿到则进行axios请求数据，进行信息存储及权限路由渲染，否则直接放行
    if (Object.keys(userInfo).length < 1 || !userInfo) {
      // 获取用户个人信息
      const getMes = async () => {
        try {
          const userMes = await getUserAPI();
          setUserInfo(userMes.data.result as IgetInfoType);

          const {
            data: { result },
          } = await getRoutersAPI();
          setRouters(result as RouteType[]);
        } catch (error) {}
      };
      getMes();
    }

    return props.children;
  }
  if (whitePaths.includes(pathname)) {
    return props.children;
  }
  return <Navigate to="/login" replace />;
};
