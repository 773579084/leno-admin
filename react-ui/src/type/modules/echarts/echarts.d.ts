// 给props添加类型检查
export interface IProps {
  title?: string //图表的标题（为string类型）
  xData?: string[] //图表x轴数据的数组（数字里面每一项都为string类型）
  seriesData?: number[] //跟x轴每个坐标点对应的数据（数字里面每一项都为number类型）
}
