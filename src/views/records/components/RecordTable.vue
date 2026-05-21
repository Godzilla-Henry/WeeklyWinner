<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ProfitRecord } from '@/types/module/records';

interface Props {
  records: ProfitRecord[];
}

defineProps<Props>();

function formatCurrency(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toLocaleString()}`;
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-border bg-card">
    <Table>
      <TableHeader>
        <TableRow class="border-b border-border bg-muted/30">
          <TableHead class="w-[120px] px-4 text-left text-xs font-semibold">
            股票名稱
          </TableHead>
          <TableHead class="px-4 text-center text-xs font-semibold">
            損益金額
          </TableHead>
          <TableHead class="px-4 text-center text-xs font-semibold">
            備註
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="records.length === 0">
          <TableCell
            colspan="3"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            尚無紀錄
          </TableCell>
        </TableRow>
        <TableRow
          v-for="record in records"
          :key="record.id"
          class="border-b border-border/50 last:border-0"
        >
          <TableCell class="w-[120px] px-4 text-left text-sm font-medium text-foreground">
            {{ record.stockName }}
          </TableCell>
          <TableCell class="px-4 text-center">
            <Badge
              :variant="record.profitLoss >= 0 ? 'gain' : 'loss'"
              class="font-mono text-xs"
            >
              {{ formatCurrency(record.profitLoss) }}
            </Badge>
          </TableCell>
          <TableCell class="px-4 text-center text-sm text-muted-foreground">
            {{ record.note || '—' }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
