<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { PieDataItem } from '@/types/module/records';

const props = defineProps<Props>();

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

interface Props {
  data: PieDataItem[];
}

/**
 * 色盤 — 柔和暖色系，各項目明確區分
 */
const COLORS = [
  '#FDBA74', // 珊瑚橘
  '#94A3B8', // 迷霧藍
  '#5EEAD4', // 薄荷綠
  '#C4B5FD', // 薰衣草紫
  '#F9A8D4', // 玫瑰粉
  '#FCD34D', // 琥珀黃
  '#A8A29E', // 暖灰
  '#BEF264', // 開心果綠
];

/* ── 響應式容器寬度偵測 ── */
const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(600);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth;
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        containerWidth.value = entry.contentRect.width;
      }
    });
    resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

/** 是否為窄螢幕（< 600px） */
const isNarrow = computed((): boolean => containerWidth.value < 600);

/** 資料項目是否過多（> 6 項啟用防重疊優化） */
const hasManyItems = computed((): boolean => props.data.length > 6);

/**
 * 響應式 ECharts 配置
 * - 窄螢幕：Legend 移至底部，圓餅居中
 * - 寬螢幕：Legend 在右側，圓餅偏左
 * - 項目過多：隱藏外部 Label，僅靠 Tooltip + Legend
 */
const option = computed((): EChartsOption => {
  const narrow = isNarrow.value;
  const tooMany = hasManyItems.value;

  /* 是否顯示外部 Label（窄螢幕 + 項目多時隱藏） */
  const showLabel = !(narrow && tooMany);

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#f4f4f5',
      borderWidth: 1,
      textStyle: { fontSize: 12, color: '#27272a' },
      formatter: (params: unknown): string => {
        const p = params as { name: string; value: number; percent: number };
        return `<strong>${p.name}</strong><br/>${p.value.toLocaleString()}（${p.percent.toFixed(1)}%）`;
      },
    },

    /* Legend 響應式配置 */
    legend: narrow
      ? {
          orient: 'horizontal',
          bottom: 0,
          left: 'center',
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 10,
          type: 'scroll',
          pageIconSize: 10,
          textStyle: { fontSize: 11, color: '#52525b' },
        }
      : {
          orient: 'vertical',
          right: 8,
          top: 'center',
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 12,
          type: props.data.length > 8 ? 'scroll' : 'plain',
          pageIconSize: 12,
          textStyle: { fontSize: 12, color: '#52525b' },
        },

    color: COLORS,

    series: [
      {
        type: 'pie',
        /* 響應式半徑與中心點 */
        radius: narrow ? ['35%', '60%'] : ['38%', '68%'],
        center: narrow ? ['50%', '45%'] : ['35%', '50%'],
        avoidLabelOverlap: true,
        /* 極小扇區最小角度，確保 Label 有空間 */
        minAngle: 5,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2,
        },

        /* Label 配置 — 根據空間動態切換 */
        label: showLabel
          ? {
              show: true,
              position: 'outside',
              formatter: (params: unknown): string => {
                const p = params as { name: string; value: number; percent: number };
                /* 項目多時只顯示名稱 + 百分比，省略金額 */
                if (tooMany) {
                  return `{name|${p.name}} {percent|${p.percent.toFixed(1)}%}`;
                }
                return `{name|${p.name}} {percent|${p.percent.toFixed(1)}%}\n{value|${p.value.toLocaleString()}}`;
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
            }
          : {
              show: false,
            },

        /* 引導線 — Label 顯示時才啟用 */
        labelLine: {
          show: showLabel,
          length: narrow ? 8 : 12,
          length2: narrow ? 6 : 8,
          smooth: true,
        },

        emphasis: {
          /* 強調時顯示 Label（即使平時隱藏） */
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
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
  };
});
</script>

<template>
  <div
    ref="containerRef"
    class="flex h-80 w-full items-center justify-center"
  >
    <VChart
      v-if="data.length > 0"
      :option="option"
      autoresize
      class="h-full w-full"
    />
    <p
      v-else
      class="text-sm text-muted-foreground"
    >
      當月無獲利紀錄
    </p>
  </div>
</template>
