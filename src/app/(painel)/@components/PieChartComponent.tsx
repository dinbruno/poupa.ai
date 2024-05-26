import React from 'react';
import ReactECharts from 'echarts-for-react';

const PieChartComponent: React.FC<{ data: any[] }> = ({ data }) => {
  // Filtrar os dados para incluir apenas itens fixos e dividir entre entradas e saídas
  const processedData = data.filter(item => item.isFixedExpense).reduce((acc, item) => {
    const key = item.type === 'Despesa' ? 'Entradas Fixas' : 'Saídas Fixas';
    if (acc[key]) {
      acc[key].value += item.value;
    } else {
      acc[key] = {
        value: item.value,
        name: key
      };
    }
    return acc;
  }, {});

  const chartData = Object.values(processedData);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Gastos Fixos',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 300, width: 300 }} />;
};

export default PieChartComponent;
