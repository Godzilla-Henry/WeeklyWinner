<script setup lang="ts">
import { computed } from 'vue';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';

interface Props {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  volume: number;
}

const props = defineProps<Props>();

const isPositive = computed((): boolean => props.change >= 0);
</script>

<template>
  <Card class="group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover)">
    <div class="flex flex-col gap-3 p-5">
      <!-- 標題 + 漲跌圖標 -->
      <div class="flex items-center justify-between">
        <p class="text-xs font-medium tracking-wide text-muted-foreground">{{ props.name }}</p>
        <div
          class="flex h-7 w-7 items-center justify-center rounded-lg"
          :class="isPositive ? 'bg-gain/8' : 'bg-loss/8'"
        >
          <TrendingUp v-if="isPositive" :size="14" :stroke-width="2" class="text-gain" />
          <TrendingDown v-else :size="14" :stroke-width="2" class="text-loss" />
        </div>
      </div>

      <!-- 數值 -->
      <p class="text-2xl font-bold tabular-nums tracking-tight text-foreground">
        {{ props.value.toLocaleString() }}
      </p>

      <!-- 漲跌幅 -->
      <span
        class="text-sm font-semibold tabular-nums"
        :class="isPositive ? 'text-gain' : 'text-loss'"
      >
        {{ isPositive ? '+' : '' }}{{ props.change.toLocaleString() }}
        ({{ isPositive ? '+' : '' }}{{ props.changePercent.toFixed(2) }}%)
      </span>

      <!-- 成交量 -->
      <div class="flex items-center justify-between border-t border-border pt-3">
        <span class="text-xs text-muted-foreground">成交量</span>
        <span class="text-xs font-medium tabular-nums text-foreground">
          {{ props.volume.toLocaleString() }} 億
        </span>
      </div>
    </div>
  </Card>
</template>
