<script setup lang="ts">
import { computed } from 'vue';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-vue-next';
import type { MarketIndexData } from '@/types/module/market';

interface Props {
  data: MarketIndexData | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const isPositive = computed((): boolean => (props.data?.change ?? 0) >= 0);

function fmt(value: number | undefined): string {
  if (value === undefined) return '—';
  return value.toLocaleString();
}

function fmtPercent(value: number | undefined): string {
  if (value === undefined) return '—';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}
</script>

<template>
  <Card class="group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover)">
    <div class="flex flex-col gap-3 p-5">
      <!-- Loading skeleton -->
      <template v-if="props.loading && !props.data">
        <div class="flex items-center justify-between">
          <Skeleton class="h-5 w-20" />
          <Skeleton class="h-7 w-7 rounded-lg" />
        </div>
        <Skeleton class="h-8 w-36" />
        <Skeleton class="h-4 w-28" />
        <div class="flex items-center justify-between border-t border-border pt-3">
          <Skeleton class="h-3 w-20" />
          <Skeleton class="h-3 w-24" />
        </div>
      </template>

      <!-- 資料 / 錯誤狀態 -->
      <template v-else>
        <div class="flex items-center justify-between">
          <p class="text-base font-bold tracking-wide text-brand">
            {{ props.data?.name ?? '加權指數' }}
          </p>
          <div
            v-if="props.data"
            class="flex h-7 w-7 items-center justify-center rounded-lg"
            :class="isPositive ? 'bg-gain/8' : 'bg-loss/8'"
          >
            <TrendingUp v-if="isPositive" :size="14" :stroke-width="2" class="text-gain" />
            <TrendingDown v-else :size="14" :stroke-width="2" class="text-loss" />
          </div>
        </div>

        <p class="text-2xl font-bold tabular-nums tracking-tight text-foreground">
          {{ fmt(props.data?.value) }}
        </p>

        <span
          class="text-sm font-semibold tabular-nums"
          :class="props.data ? (isPositive ? 'text-gain' : 'text-loss') : 'text-muted-foreground'"
        >
          <template v-if="props.data">
            {{ isPositive ? '+' : '' }}{{ fmt(props.data.change) }}
            ({{ fmtPercent(props.data.changePercent) }})
          </template>
          <template v-else>—</template>
        </span>

        <div class="flex items-center justify-between border-t border-border pt-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted-foreground">成交量</span>
            <span class="text-xs font-medium tabular-nums text-foreground">
              {{ props.data ? `${fmt(props.data.volume)} 億` : '—' }}
            </span>
          </div>
          <div class="flex items-center gap-1.5">
            <Loader2 v-if="props.loading" :size="10" :stroke-width="2" class="animate-spin text-muted-foreground/50" />
            <span v-if="props.data?.updatedAt" class="text-[10px] tabular-nums text-muted-foreground/60">
              {{ props.data.updatedAt }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </Card>
</template>
