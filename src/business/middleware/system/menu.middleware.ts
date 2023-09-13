import { Context } from 'koa';
import { Op } from 'sequelize';
import { getRoutersSer, getMenusSer } from '@/business/service/system/menu.service';
import { addSer, delSer, getDetailSer, putSer, queryConditionsData } from '@/business/service';
import { formatHumpLineTransfer } from '@/business/utils';
import { MenuParamsType, menusSqlType, menusType, RouteType, userType } from '@/types';
import { addJudg, putJudg } from '@/business/schema/system/sys_menus.schema';
import errors from '@/app/err.type';
import SysMenu from '@/mysql/model/system/menu.model';
import { getUserRoleSer } from '@/business/service/system/user.service';
import SysRoleMenu from '@/mysql/model/system/sys_role_menu.model';
import { bindCheck } from '@/business/utils/bind';
import { saveMenuMes } from '@/business/utils/redis';

const { delErr, getRoutersErr, getListErr, uploadParamsErr, addErr, sqlErr } = errors;

// 获取菜单数据并进行数据转换
export const conversionMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 获取数据库菜单数据
    const firstRes = await getRoutersSer();
    const newRes = formatHumpLineTransfer(firstRes, 'hump');
    ctx.state.menus = newRes;
  } catch (error) {
    console.error('前端路由获取失败', error);
    return ctx.app.emit('error', getRoutersErr, ctx);
  }
  await next();
};

// 生成前端menu路由
export const getRouterMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { menus } = ctx.state;
    const routers = [] as RouteType[];
    menus.sort((a: { orderNum: number }, b: { orderNum: number }) => a.orderNum - b.orderNum);

    const createRoute = (route: RouteType, parentId: number) => {
      menus.forEach((menu: menusType) => {
        if (menu.parentId === parentId) {
          const routeChild = {
            name: menu.path,
            path: menu.path,
            query: menu.query,
            alwaysShow: menu.menuType === 'M',
            element: menu.component,
            hidden: menu.visible !== '0',
            children: [],
            perms: menu.perms,
            meta: {
              title: menu.menuName,
              link: menu.isFrame ? null : menu.path,
              noCache: !menu.isCache,
              icon: menu.icon,
            },
          };
          route.children.push(routeChild);

          createRoute(routeChild, menu.menuId);
        }
      });

      if (route.children.length < 1) {
        // eslint-disable-next-line no-param-reassign
        delete route.children;
      }
    };

    menus.forEach((menu: menusType) => {
      if (menu.parentId === 0) {
        const route = {} as RouteType;
        Object.assign(route, {
          name: menu.path,
          path: `/${menu.path}`,
          alwaysShow: menu.menuType === 'M',
          element: menu.component,
          hidden: menu.visible !== '0',
          children: [],
          query: menu.query,
          perms: menu.perms,
          meta: {
            title: menu.menuName,
            link: menu.isFrame ? null : menu.path,
            noCache: !menu.isCache,
            icon: menu.icon,
          },
        });
        createRoute(route, menu.menuId);

        if (route.children && route.children.length < 1) {
          delete route.children;
        }
        routers.push(route);
      }
    });

    saveMenuMes(routers);
    ctx.state.formatData = routers;
    // 按照路由格式存储一级菜单
  } catch (error) {
    console.error('前端路由创建失败', error);
    return ctx.app.emit('error', getRoutersErr, ctx);
  }
  await next();
};

// 获取菜单列表
export const getMenusMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const params = ctx.query as unknown as MenuParamsType;
    const whereObj = {};
    const { status, menuName } = params;
    if (status) Object.assign(whereObj, { status });
    if (menuName) Object.assign(whereObj, { menu_name: { [Op.like]: `${menuName}%` } });

    // 找出用户id 关联的 菜单信息
    const { userId } = ctx.state.user as userType;
    if (userId !== 1) {
      // 1 查找用户关联的角色id
      const roleIds = (await getUserRoleSer(userId)) as unknown as { role_id: number }[];
      const ids = roleIds.map((item) => item.role_id);

      // 2 查找角色关联的菜单id
      const menuRoles = await queryConditionsData(SysRoleMenu, { role_id: { [Op.in]: ids } });
      const menuIds = menuRoles.map((item) => item.menu_id);
      const filterMenuIds = Array.from(new Set(menuIds));
      Object.assign(whereObj, { menu_id: { [Op.in]: filterMenuIds } });
    }

    // 获取数据库菜单数据
    const res = await getMenusSer(whereObj);
    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('菜单列表获取失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 检查新增上传参数 judge 判断时新增或修改
export const addEditSchema = (judge: string) => async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.body as menusType;
    if (judge === 'add') {
      await addJudg.validateAsync(list);
    } else {
      await putJudg.validateAsync(list);
    }
  } catch (error) {
    console.error('新增上传参数出错', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
  await next();
};

// 新增
export const addMenuMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.body as menusType;
    const menu = formatHumpLineTransfer(list, 'line');

    // 获取数据库菜单数据
    await addSer(SysMenu, menu);
  } catch (error) {
    console.error('新增菜单失败', error);
    return ctx.app.emit('error', addErr, ctx);
  }
  await next();
};

// 删除
export const delMenuMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const ids = ctx.state.ids as string[];

    if ((await bindCheck(SysMenu, { parent_id: ids })).length > 0) {
      ctx.body = {
        code: 500,
        message: '存在子菜单,不允许删除',
      };
    } else if ((await bindCheck(SysRoleMenu, { menu_id: ids })).length > 0) {
      ctx.body = {
        code: 500,
        message: '菜单已分配,不允许删除',
      };
    } else {
      await delSer(SysMenu, { menu_id: ids });
      await next();
    }
  } catch (error) {
    console.error('删除菜单失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }
};

// 获取详情
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer(SysMenu, { menu_id: ctx.state.ids });
    ctx.state.formatData = res;
  } catch (error) {
    console.error('获取详情失败', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }
  await next();
};

// 修改用户
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const res = ctx.request.body as menusType;
    const menu = formatHumpLineTransfer(res, 'line') as unknown as menusSqlType;
    const { menu_id, ...data } = menu;
    await putSer(SysMenu, { menu_id }, { ...data, update_by: userName });

    await next();
  } catch (error) {
    console.error('修改失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};
