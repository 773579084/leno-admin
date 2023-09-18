/**
 * 自定义 组件props传值对比
 * @param oldProps
 * @param newProps
 * @returns boolean
 */
export const arePropsEqual = (oldProps: any, newProps: any): boolean => {
  if (JSON.stringify(oldProps) === JSON.stringify(newProps)) {
    return true;
  }
  return false;
};

/**
 * 处理svg图片字符串
 * @param svgString
 * @returns
 */
export const parseSVG = (svgString: string) => {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(svgString, 'image/svg+xml');

  return xmlDoc.documentElement.outerHTML;
};

/**
 * 删除tab内信息，页面跳转逻辑
 * @param count
 * @param queryParams
 * @param setQueryParams
 */
export const pageDelJump = (count: number, ids: string, queryParams: { pageNum: number; pageSize: number }, setQueryParams: any) => {
  const pageNum = Math.ceil((count - ids.split(',').length) / queryParams.pageSize);
  if (pageNum < queryParams.pageNum) {
    setQueryParams({
      pageNum: pageNum || 1,
      pageSize: queryParams.pageSize,
    });
  } else {
    setQueryParams({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
    });
  }
};
