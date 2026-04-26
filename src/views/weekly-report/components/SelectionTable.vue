<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { StockSelection, StockType } from '@/types/module/report';

interface Props {
  selections: StockSelection[];
}

const props = defineProps<Props>();

function typeVariant(type: StockType): 'gain' | 'brand' | 'secondary' {
  if (type === '技術面強勢') return 'gain';
  if (type === '技術面轉強') return 'brand';
  return 'secondary';
}

function biasClass(value: number): string {
  if (value > 0) return 'text-gain';
  if (value < 0) return 'text-loss';
  return 'text-foreground';
}
</script>

<template>
  <!-- 桌面版：表格 -->
  <Card class="hidden md:block">
    <CardContent class="px-4 py-6">
      <div class="overflow-x-auto rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="min-w-20">股票</TableHead>
              <TableHead class="min-w-28">類型</TableHead>
              <TableHead class="min-w-40">產業</TableHead>
              <TableHead class="min-w-40">基本面</TableHead>
              <TableHead class="min-w-40">技術面</TableHead>
              <TableHead class="min-w-28 text-right">收盤價</TableHead>
              <TableHead class="min-w-28 text-right">20MA</TableHead>
              <TableHead class="min-w-28 text-right">月線乖離</TableHead>
              <TableHead class="min-w-28 text-right">目標價</TableHead>
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

  <!-- 行動版：卡片列表 -->
  <div class="flex flex-col gap-3 md:hidden">
    <Card v-for="s in props.selections" :key="s.symbol">
      <CardContent class="flex flex-col gap-3 p-5">
        <!-- 標題列 -->
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-bold text-foreground">{{ s.name }}</p>
              <p class="text-xs text-brand/95">{{ s.symbol }}</p>
            </div>
            <p class="text-xs text-muted-foreground">{{ s.industry }}</p>
          </div>
          <Badge :variant="typeVariant(s.type)">{{ s.type }}</Badge>
        </div>

        <!-- 價格區 -->
        <div class="grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-3">
          <div class="text-center">
            <p class="text-[10px] text-muted-foreground">收盤價</p>
            <p class="font-mono text-sm font-semibold tabular-nums text-foreground">{{ s.closePrice.toLocaleString() }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] text-muted-foreground">20MA</p>
            <p class="font-mono text-sm tabular-nums text-muted-foreground">{{ s.ma20.toLocaleString() }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] text-muted-foreground">月線乖離</p>
            <p class="font-mono text-sm font-semibold tabular-nums" :class="biasClass(s.monthlyBias)">
              {{ s.monthlyBias >= 0 ? '+' : '' }}{{ s.monthlyBias.toFixed(1) }}%
            </p>
          </div>
        </div>

        <!-- 分析 + 目標價 -->
        <div class="flex items-end justify-between">
          <div class="flex flex-col gap-1 text-xs text-muted-foreground">
            <span v-if="s.fundamental !== '- -'">基本面：{{ s.fundamental }}</span>
            <span v-if="s.technical !== '- -'">技術面：{{ s.technical }}</span>
          </div>
          <div v-if="s.targetPrice > 0" class="w-20 text-center">
            <p class="text-[10px] text-muted-foreground">目標價</p>
            <p class="font-mono text-base font-bold tabular-nums text-brand">{{ s.targetPrice.toLocaleString() }}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
