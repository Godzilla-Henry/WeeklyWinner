<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useTradeRecords, usePeriodSummaries } from '@/composables/useMockPortfolio';

const records = useTradeRecords();
const summaries = usePeriodSummaries();
</script>

<template>
  <DefaultLayout title="收益統計" subtitle="自動彙整各週期損益">
    <!-- 週期統計卡片 -->
    <div class="grid grid-cols-3 gap-3">
      <Card v-for="s in summaries" :key="s.period">
        <CardContent class="p-4">
          <p class="text-xs font-medium text-muted-foreground">{{ s.label }}</p>
          <p
            class="mt-1 text-lg font-bold"
            :class="s.totalProfitLoss >= 0 ? 'text-gain' : 'text-loss'"
          >
            {{ s.totalProfitLoss >= 0 ? '+' : '' }}{{ s.totalProfitLoss.toLocaleString() }}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            {{ s.tradeCount }} 筆 · 勝率 {{ s.winRate }}%
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- 操作日誌 -->
    <Card>
      <CardHeader>
        <CardTitle>操作日誌</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs default-value="all">
          <TabsList class="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="buy">買入</TabsTrigger>
            <TabsTrigger value="sell">賣出</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>操作</TableHead>
                  <TableHead>股票</TableHead>
                  <TableHead class="text-right">損益</TableHead>
                  <TableHead class="text-right">日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="r in records" :key="r.id">
                  <TableCell>
                    <Badge :variant="r.action === 'buy' ? 'gain' : 'loss'">
                      {{ r.action === 'buy' ? '買' : '賣' }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p class="font-medium text-foreground">{{ r.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ r.symbol }} · {{ r.shares.toLocaleString() }} 股 @ {{ r.price }}</p>
                  </TableCell>
                  <TableCell class="text-right">
                    <span v-if="r.profitLoss !== 0" class="font-medium" :class="r.profitLoss > 0 ? 'text-gain' : 'text-loss'">
                      {{ r.profitLoss > 0 ? '+' : '' }}{{ r.profitLoss.toLocaleString() }}
                    </span>
                    <span v-else class="text-muted-foreground">—</span>
                  </TableCell>
                  <TableCell class="text-right text-muted-foreground">{{ r.date }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="buy">
            <Table>
              <TableBody>
                <TableRow v-for="r in records.filter(r => r.action === 'buy')" :key="r.id">
                  <TableCell><Badge variant="gain">買</Badge></TableCell>
                  <TableCell>
                    <p class="font-medium text-foreground">{{ r.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ r.shares.toLocaleString() }} 股 @ {{ r.price }}</p>
                  </TableCell>
                  <TableCell class="text-right text-muted-foreground">{{ r.date }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="sell">
            <Table>
              <TableBody>
                <TableRow v-for="r in records.filter(r => r.action === 'sell')" :key="r.id">
                  <TableCell><Badge variant="loss">賣</Badge></TableCell>
                  <TableCell>
                    <p class="font-medium text-foreground">{{ r.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ r.shares.toLocaleString() }} 股 @ {{ r.price }}</p>
                  </TableCell>
                  <TableCell class="text-right font-medium text-gain">+{{ r.profitLoss.toLocaleString() }}</TableCell>
                  <TableCell class="text-right text-muted-foreground">{{ r.date }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </DefaultLayout>
</template>
