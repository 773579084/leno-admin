/**
 * 自定义 组件props传值对比
 * @param oldProps
 * @param newProps
 * @returns boolean
 */
export const arePropsEqual = (oldProps: Object, newProps: Object): boolean => {
  if (JSON.stringify(oldProps) === JSON.stringify(newProps)) {
    return true
  } else {
    return false
  }
}

/**
 * 处理svg图片字符串
 * @param svgString
 * @returns
 */
export const parseSVG = (svgString: string) => {
  const parser = new DOMParser()

  const xmlDoc = parser.parseFromString(svgString, 'image/svg+xml')

  return xmlDoc.documentElement.outerHTML
}
