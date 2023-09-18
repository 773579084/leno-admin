import ReactECharts from 'echarts-for-react';
import { Info } from '@/type/modules/monitor/cache';

const TableDisc = (props: { data: Info }) => {
  const {
    data: { memory, memoryShow },
  } = props;

  const memoryFn = () => {
    if (memoryShow.indexOf('K')) {
      return Number(memory) / 1024;
    }
    return Number(memory) / 1024 / 1024;
  };
  const option = {
    tooltip: { formatter: `{b} <br/>{a} : ${333}` },
    series: [
      {
        name: '峰值',
        type: 'gauge',
        radius: '85%',
        center: ['50%', '60%'],
        axisLine: {
          lineStyle: {
            width: 15,
            color: [
              [0.2, '#91c7ae'],
              [0.8, '#63869e'],
              [1, '#c23531'],
            ],
          },
        },
        min: 0,
        max: 1000,
        pointer: {
          // 仪表盘指针
          width: 10,
          length: '60%',
          itemStyle: { color: 'auto' },
        },
        detail: {
          formatter: memoryShow,
          fontSize: 16,
          color: 'auto',
        },
        data: [
          {
            value: memoryFn(),
            name: '内存消耗',
          },
        ],
      },
    ],
  };

  return <ReactECharts option={option} />;
};

export default TableDisc;
