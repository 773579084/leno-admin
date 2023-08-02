import ReactECharts from 'echarts-for-react'

const Pie = (props: { data: { name: string; value: string }[] }) => {
  const { data } = props
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: [
      {
        name: '命令',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '50%'],
        data,
        animationEasing: 'cubicInOut',
        animationDuration: 1000,
      },
    ],
  }

  return <ReactECharts option={option} />
}

export default Pie
