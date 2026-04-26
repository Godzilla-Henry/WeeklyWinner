<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { TrendingUp, Wallet } from 'lucide-vue-next';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import LiquidCard from './components/LiquidCard.vue';
import LiquidBar from './components/LiquidBar.vue';
import HoldingRow from './components/HoldingRow.vue';
import { useHoldings } from '@/composables/useMockPortfolio';

const router = useRouter();
const holdings = useHoldings();

const totalValue = computed((): number =>
  holdings.reduce((sum, h) => sum + h.currentPrice * h.shares, 0),
);

const totalProfitLoss = computed((): number =>
  holdings.reduce((sum, h) => sum + h.profitLoss, 0),
);

const totalProfitLossPercent = computed((): number => {
  const totalCost = holdings.reduce((sum, h) => sum + h.avgCost * h.shares, 0);
  if (totalCost === 0) return 0;
  return (totalProfitLoss.value / totalCost) * 100;
});

const barColors: string[] = [
  'bg-amber-400', 'bg-orange-500', 'bg-emerald-400',
  'bg-sky-400', 'bg-violet-400', 'bg-rose-400',
];

const barSegments = computed(() =>
  holdings.map((h, i) => ({
    symbol: h.symbol,
    name: h.name,
    weight: h.weight,
    color: barColors[i % barColors.length] ?? 'bg-gray-400',
  })),
);

function navigateToStock(symbol: string): void {
  void router.push({ name: 'stock-detail', params: { symbol } });
}
</script>

<template>
  <DefaultLayout title="股市資產" subtitle="當前股市資產比例與變化">
    <!-- Liquid 總覽卡片 -->
    <LiquidCard>
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <Wallet :size="16" :stroke-width="1.75" class="text-muted-foreground" />
            <p class="text-sm font-medium text-muted-foreground">總資產市值</p>
          </div>
          <p class="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">
            {{ totalValue.toLocaleString() }}
            <span class="text-base font-medium text-muted-foreground">TWD</span>
          </p>
        </div>
        <div class="rounded-2xl bg-brand-muted px-3 py-1.5">
          <div class="flex items-center gap-1 text-sm font-semibold text-brand">
            <TrendingUp :size="14" :stroke-width="2.5" />
            <span>{{ totalProfitLossPercent >= 0 ? '+' : '' }}{{ totalProfitLossPercent.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
      <p class="mt-1 text-sm text-muted-foreground">
        未實現損益
        <span class="font-semibold text-foreground">
          {{ totalProfitLoss >= 0 ? '+' : '' }}{{ totalProfitLoss.toLocaleString() }}
        </span>
      </p>
      <div class="mt-6">
        <LiquidBar :segments="barSegments" />
      </div>
    </LiquidCard>

    <!-- 持股清單 -->
    <section class="flex flex-col gap-3">
      <p class="text-sm font-medium text-muted-foreground">持股明細</p>
      <div class="flex flex-col gap-3">
        <HoldingRow
          v-for="h in holdings"
          :key="h.symbol"
          :holding="h"
          @click="navigateToStock(h.symbol)"
        />
      </div>
    </section>
  </DefaultLayout>
</template>
