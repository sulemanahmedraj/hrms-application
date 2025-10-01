import React from 'react';
import { View } from 'react-native';
import ECharts from 'react-native-echarts-wrapper';

interface StaticChartProps {
  title: string;
  data: number[];
  labels: string[];
  color?: string;
}

export const StaticChart: React.FC<StaticChartProps> = ({
  title,
  data,
  labels,
  color = '#7C3AED',
}) => {
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#374151', fontSize: 18, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#D1D5DB' } },
      axisLabel: { color: '#374151' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#D1D5DB' } },
      axisLabel: { color: '#374151' },
      splitLine: { lineStyle: { type: 'dashed', color: '#E5E7EB' } },
    },
    series: [
      {
        type: 'bar',
        data: data,
        itemStyle: { color },
        barMaxWidth: 40,
      },
    ],
    grid: {
      top: 50,
      left: 20,
      right: 20,
      bottom: 30,
    },
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow-md">
      <ECharts option={option} height={220} />
    </View>
  );
};
