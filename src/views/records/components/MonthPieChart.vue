<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { PieDataItem } from '@/types/module/records';

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

interface Props {
  data: PieDataItem[];
}

const props = defineProps<Props>();

const COLORS = [
  '#FDBA74', // 珊瑚橘 (主色，柔和化)
  '#94A3B8', // 迷霧藍 (對比色，降低飽和與變亮)
  '#5EEAD4', // 薄荷綠 (互補色，變亮)
  '#C4B5FD', // 薰衣草紫 (冷色調，變亮)
  '#F9A8D4', // 玫瑰粉 (顯眼色，變粉嫩)
  '#FCD34D', // 琥珀黃 (橘色延伸，變亮)
  '#A8A29E', // 暖灰 (中性色，變淺)
  '#BEF264', // 開心果綠 (自然色，變嫩綠)
];

const option = computed((): EChartsOption => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: '#fff',
    borderColor: '#f4f4f5',
    borderWidth: 1,
    textStyle: { fontSize: 12, color: '#27272a' },
    formatter: (params: unknown): string => {
      const p = params as { name: string; value: number; percent: number };
      return `<strong>${p.name}</strong><br/>$${p.value.toLocaleString()}（${p.percent.toFixed(1)}%）`;
    },
  },
  legend: {
    orient: 'vertical',
    right: 8,
    top: 'center',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 12,
    textStyle: {
      fontSize: 12,
      color: '#52525b',
    },
  },
  color: COLORS,
  series: [
    {
      type: 'pie',
      radius: ['38%', '68%'],
      center: ['32%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        formatter: (params: unknown): string => {
          const p = params as { name: string; value: number; percent: number };
          return `{name|${p.name}} {percent|${p.percent.toFixed(1)}%}\n{value|${p.value.toLocaleString()}} `;
        },
        rich: {
          name: {
            fontSize: 12,
            fontWeight: 600,
            color: '#27272a',
            lineHeight: 18,
          },
          value: {
            fontSize: 11,
            color: '#52525b',
            lineHeight: 16,
          },
          percent: {
            fontSize: 11,
            color: '#a1a1aa',
            lineHeight: 16,
          },
        },
      },
      labelLine: {
        show: true,
        length: 12,
        length2: 8,
        smooth: true,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
      },
      data: props.data.map((item) => ({
        name: item.name,
        value: item.value,
      })),
    },
  ],
}));
</script>

<template>
  <div class="flex h-72 w-full items-center justify-center">
    <VChart
      v-if="data.length > 0"
      :option="option"
      autoresize
      class="h-full w-full"
    />
    <p v-else class="text-sm text-muted-foreground">當月無獲利紀錄</p>
  </div>
</template>
