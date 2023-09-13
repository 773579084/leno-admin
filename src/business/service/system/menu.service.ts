import { Op } from 'sequelize';
import SysMenu from '@/mysql/model/system/menu.model';
import { menusSqlType } from '@/types';

// 获取路由
export const getRoutersSer = async () => {
  const firstRes = (await SysMenu.findAll({
    where: {
      status: '0',
      [Op.or]: [{ menu_type: 'M' }, { menu_type: 'C' }],
    },
  })) as unknown as menusSqlType[];

  return firstRes;
};

// 获取菜单
export const getMenusSer = async (params: { [key: string]: unknown }) => {
  const res = await SysMenu.findAll({
    raw: true,
    where: params,
  });

  return res;
};
