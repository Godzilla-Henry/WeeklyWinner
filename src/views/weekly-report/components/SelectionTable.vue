<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { StockSelection, StockType } from '@/types/module/report';

interface Props {
  selections: StockSelection[];
}

const props = defineProps<Props>();

/** 類型對應 Badge 變體 */
function typeVariant(type: StockType): 'gain' | 'loss' | 'secondary' {
  if (type === '多方') return 'gain';
  if (type === '空方') return 'loss';
  return 'secondary';
}

/** 乖離率顏色 */
function biasClass(value: number): string {
  if (value > 0) return 'text-gain';
  if (value < 0) return 'text-loss';
  return 'text-foreground';
}
</script>

<template>
  <Card>
    <CardContent class="px-4 py-6">
      <div class="overflow-x-auto rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="min-w-28">股票</TableHead>
              <TableHead>類型</TableHead>
              <TableHead>產業</TableHead>
              <TableHead>基本面</TableHead>
              <TableHead>技術面</TableHead>
              <TableHead class="text-right">收盤價</TableHead>
              <TableHead class="text-right">20MA</TableHead>
              <TableHead class="text-right">月線乖離</TableHead>
              <TableHead class="text-right">目標價</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="s in props.selections" :key="s.symbol">
              <TableCell>
                <p class="font-semibold text-foreground">{{ s.name }}</p>
                <p class="text-xs text-muted-foreground">{{ s.symbol }}</p>
              </TableCell>
              <TableCell>
                <Badge :variant="typeVariant(s.type)">{{ s.type }}</Badge>
              </TableCell>
              <TableCell class="text-muted-foreground">{{ s.industry }}</TableCell>
              <TableCell class="max-w-32 text-xs text-muted-foreground">{{ s.fundamental }}</TableCell>
              <TableCell class="max-w-32 text-xs text-muted-foreground">{{ s.technical }}</TableCell>
              <TableCell class="text-right font-mono font-medium tabular-nums text-foreground">
                {{ s.closePrice.toLocaleString() }}
              </TableCell>
              <TableCell class="text-right font-mono tabular-nums text-muted-foreground">
                {{ s.ma20.toLocaleString() }}
              </TableCell>
              <TableCell class="text-right font-mono font-medium tabular-nums" :class="biasClass(s.monthlyBias)">
                {{ s.monthlyBias >= 0 ? '+' : '' }}{{ s.monthlyBias.toFixed(1) }}%
              </TableCell>
              <TableCell class="text-right font-mono font-semibold tabular-nums text-brand">
                {{ s.targetPrice.toLocaleString() }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</template>
