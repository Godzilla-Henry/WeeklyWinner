<script setup lang="ts">
import { useRoute } from 'vue-router';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { CandlestickChart } from 'lucide-vue-next';
import { useStockQuote, useCompanyInfo } from '@/composables/useMockData';

const route = useRoute();
const symbol = route.params.symbol;
const quote = useStockQuote();
const company = useCompanyInfo();

function formatMarketCap(value: number): string {
  return `${(value / 10000).toFixed(0)} 兆`;
}

interface QuoteField {
  label: string;
  value: string;
  highlight?: boolean;
}

const quoteFields: QuoteField[] = [
  { label: '開盤', value: quote.open.toLocaleString() },
  { label: '最高', value: quote.high.toLocaleString(), highlight: true },
  { label: '最低', value: quote.low.toLocaleString() },
  { label: '昨收', value: quote.prevClose.toLocaleString() },
  { label: '成交量（張）', value: quote.volume.toLocaleString() },
];

const fundamentals: QuoteField[] = [
  { label: '產業', value: company.industry },
  { label: '市值', value: formatMarketCap(company.marketCap) },
  { label: '本益比', value: company.pe.toFixed(1) },
  { label: 'EPS', value: company.eps.toFixed(2), highlight: true },
  { label: '殖利率', value: `${company.dividendYield.toFixed(2)}%` },
  { label: 'ROE', value: `${company.roe.toFixed(1)}%`, highlight: true },
];
</script>

<template>
  <DefaultLayout>
    <template #header>
      <p class="text-sm text-muted-foreground">
        {{ symbol }}
      </p>
      <h1 class="text-2xl font-bold text-foreground">
        {{ quote.name }}
      </h1>
      <div class="mt-1 flex items-baseline gap-3">
        <span class="text-3xl font-bold text-foreground">{{ quote.close }}</span>
        <Badge
          :variant="quote.change >= 0 ? 'gain' : 'loss'"
          class="text-sm"
        >
          {{ quote.change >= 0 ? '+' : '' }}{{ quote.change }}
          ({{ quote.changePercent >= 0 ? '+' : '' }}{{ quote.changePercent.toFixed(2) }}%)
        </Badge>
      </div>
    </template>

    <!-- K 線圖占位符 -->
    <Card class="border-dashed">
      <CardContent class="flex h-52 items-center justify-center p-6">
        <div class="text-center">
          <CandlestickChart
            :size="40"
            :stroke-width="1.5"
            class="mx-auto text-muted-foreground/50"
          />
          <p class="mt-2 text-sm text-muted-foreground">
            K 線圖區域（預留 ECharts / TradingView）
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- 報價數據 -->
    <Card>
      <CardHeader>
        <CardTitle>報價數據</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow
              v-for="f in quoteFields"
              :key="f.label"
            >
              <TableCell class="text-muted-foreground">
                {{ f.label }}
              </TableCell>
              <TableCell
                class="text-right font-medium"
                :class="f.highlight ? 'text-brand' : 'text-foreground'"
              >
                {{ f.value }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- 公司資訊 -->
    <Card>
      <CardHeader>
        <CardTitle>公司資訊</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="mb-4 text-sm leading-relaxed text-muted-foreground">
          {{ company.description }}
        </p>
        <Table>
          <TableBody>
            <TableRow
              v-for="f in fundamentals"
              :key="f.label"
            >
              <TableCell class="text-muted-foreground">
                {{ f.label }}
              </TableCell>
              <TableCell
                class="text-right font-medium"
                :class="f.highlight ? 'text-brand' : 'text-foreground'"
              >
                {{ f.value }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </DefaultLayout>
</template>
