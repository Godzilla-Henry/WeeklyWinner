<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { BarDataItem } from '@/types/module/records';

const props = defineProps<Props>();

use([BarChart, TooltipComponent, GridComponent, CanvasRenderer]);

interface Props {
  data: BarDataItem[];
}

const option = computed((): EChartsOption => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: (params: unknown): string => {
      const p = (params as { name: string; value: number }[])[0];
      if (!p) return '';
      const sign = p.value >= 0 ? '+' : '';
      const abs = Math.abs(p.value);
      const display = abs >= 10000
        ? `${(abs / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}萬`
        : abs.toLocaleString();
      return `${p.name}月<br/>損益：${sign}${p.value < 0 ? '-' : ''}${display}`;
    },
  },
  grid: {
    left: 16,
    right: 16,
    top: 24,
    bottom: 24,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => `${d.month}`),
    axisLabel: {
      fontSize: 11,
      color: '#71717a',
    },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 11,
      color: '#71717a',
      formatter: (val: number): string => {
        if (val === 0) return '0';
        const abs = Math.abs(val);
        const sign = val > 0 ? '+' : '-';
        if (abs >= 10000) {
          return `${sign}${(abs / 10000).toLocaleString()}萬`;
        }
        return `${sign}${abs.toLocaleString()}`;
      },
    },
    splitLine: {
      lineStyle: { color: '#f4f4f5', type: 'dashed' },
    },
  },
  series: [
    {
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: (params: { value: number }): string =>
          params.value >= 0 ? '#E8920A' : '#F43F5E',
      },
      data: props.data.map((d) => d.value),
    },
  ],
}));
</script>

<template>
  <div class="h-64 w-full">
    <VChart
      :option="option"
      autoresize
      class="h-full w-full"
    />
  </div>
</template>
