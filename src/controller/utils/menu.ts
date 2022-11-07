import { menusType } from '../../types'
// 生成前端路由表
export function createRouters(routers: menusType[]) {
  const routerMenus = []

  /**
   * 1、用 map 操作数组，先用 find 将所有一级目录找出放入到新的数组中，原数组里一级目录全部被剔除
   * 2、再用一级目录里面的 id 与 剩余对象的 parent_id 对比，相似则剔除，放入到新数组的一级目录下
   * 3、再用二级目录里面的 id 与 剩余对象的 parent_id 对比，相似则剔除，放入到新数组的二级目录下（层级以此下推，最后原数组为空后，退出）
   */

  return routerMenus
}

// {
//     name: item.path,
//     path: '/' + item.path,
//     element: 'Layout',
//     alwayShow: true,
//     hidden: item.visible,
//     meta: {
//       icon: item.icon,
//       link: item.path,
//       noCache: item.is_cache.indexOf('http') ? item.is_cache : null,
//       title: item.menu_name
//     },
//     children: []
//   }
