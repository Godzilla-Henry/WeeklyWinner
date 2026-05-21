<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  holding: HoldingItem;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <Card
    class="cursor-pointer p-4 hover:-translate-y-0.5"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-muted text-xs font-bold text-brand">
          {{ props.holding.symbol.slice(0, 2) }}
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">
            {{ props.holding.name }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ props.holding.symbol }} · {{ props.holding.shares.toLocaleString() }} 股
          </p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-sm font-semibold tabular-nums text-foreground">
          {{ props.holding.currentPrice }}
        </p>
        <Badge
          :variant="props.holding.profitLoss >= 0 ? 'gain' : 'loss'"
          class="mt-0.5"
        >
          {{ props.holding.profitLoss >= 0 ? '+' : '' }}{{ props.holding.profitLossPercent.toFixed(2) }}%
        </Badge>
      </div>
    </div>
  </Card>
</template>
