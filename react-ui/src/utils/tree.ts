import { IIsActive } from '@/type'

/* 当前高亮函数 */
export function currentHighLightFn(obj: IIsActive): string {
  const { isActive } = obj
  return isActive ? 'sidebar current-highlight' : 'sidebar'
}

/**
 * table 通用树数据结构处理
 * @param list 不确定的数据对象结构
 * @param parentId 父id的名
 * @param childId  字id的名
 * @returns tree结构
 */
export function generalTreeFn(list: any[], parentId: string, childId: string) {
  const trees: { children: never[] }[] = []

  list.forEach((tree) => {
    if (tree[parentId] === 0) {
      const obj = {
        children: [],
      } as any
      Object.assign(obj, { ...tree, children: [] })

      createChild(obj, tree[childId])

      if (obj.children && !obj.children.length) {
        delete obj.children
      }

      trees.push(obj)
    }
  })

  function createChild(tree: any, id: number) {
    list.forEach((item) => {
      if (item[parentId] === id) {
        const obj = {
          children: [],
        } as any
        Object.assign(obj, { ...item, children: [] })
        tree.children?.push(obj)
        createChild(obj, item[childId] as number)

        if (obj.children && !obj.children.length) {
          delete obj.children
        }
      }
    })
  }

  return trees
}

/**
 * 解决ant 半选回显全选问题
 * @param treeData
 * @param selectIds
 * @param mainId
 */
export const solveAntHalfSelect = (treeData: any[], selectIds: number[], mainId: string) => {
  // 1 判断是否由children,有的话则把id到selectIds里面查找，有的话则删除
  const filterIds: number[] = []
  function judgeIsParent(treeData: any[]) {
    treeData.forEach((item) => {
      if (item.children && item.children.length > 0) {
        const index = selectIds.findIndex((id) => item[mainId] === id)
        if (index !== -1) filterIds.push(selectIds[index])
        judgeIsParent(item.children)
      }
    })
  }
  judgeIsParent(treeData)

  return selectIds.filter((id) => !filterIds.some((item) => item === id))
}
