import React from 'react';
import ReactECharts from 'echarts-for-react';

const MixedBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Inicialize cada mês com valores zero para entradas e despesas
  const monthlyData = months.map(month => ({
    month,
    Entrada: 0,
    Despesa: 0
  }));

  console.log(data, "data")

  // Preencher com os dados reais
  data.forEach(item => {
    const date = item.createdAt.toDate(); // Converte Timestamp para Date
    const monthIndex = date.getMonth(); // Obtém o índice do mês
    if (item.type === 'Entrada') {
      monthlyData[monthIndex].Entrada += item.value;
    } else if (item.type === 'Despesa') {
      monthlyData[monthIndex].Despesa += item.value;
    }
  });

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Entrada', 'Despesa']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Entrada',
        type: 'bar',
        data: monthlyData.map(item => item.Entrada),
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'Despesa',
        type: 'bar',
        data: monthlyData.map(item => item.Despesa),
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export default MixedBarChart;
