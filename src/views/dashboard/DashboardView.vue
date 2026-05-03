<script setup lang="ts">
import { ref, computed } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MarketIndexCard from './components/MarketIndexCard.vue';
import ReportCard from './components/ReportCard.vue';
import NoteCard from './components/NoteCard.vue';
import { useMarketIndex } from '@/composables/module/useMarketIndex';
import { useReportsQuery } from '@/composables/module/useReportQuery';
import { useReadStatusQuery } from '@/composables/module/useUnreadQuery';
import type { InvestNote } from './types';

/* ── 加權指數 ── */
const { index, loading, error, refresh } = useMarketIndex();

/* ── 週報列表（API） ── */
const page = ref(1);
const {
  data: reportsData,
  isLoading: reportsLoading,
  error: reportsError,
} = useReportsQuery(page);

/* ── 已讀狀態（紅點判斷） ── */
const { data: readStatusData } = useReadStatusQuery('weekly_report');
const readIds = computed((): string[] => readStatusData.value?.readIds ?? []);

/* ── 投資記事（暫用 Mock） ── */
const notes: InvestNote[] = [
  {
    id: 'n1',
    category: 'direction',
    title: '短線偏多，留意量能變化',
    content: '加權指數站穩季線之上，短線維持偏多操作。若量能未能持續放大，建議降低追價意願，以拉回佈局為主。',
    date: '2026-04-25',
  },
  {
    id: 'n2',
    category: 'indicator',
    title: 'VIX 恐慌指數回落至 14',
    content: 'CBOE VIX 指數從上週的 18.5 回落至 14.2，顯示市場恐慌情緒降溫，有利於風險性資產表現。',
    date: '2026-04-24',
  },
  {
    id: 'n3',
    category: 'event',
    title: '聯準會利率決議下週登場',
    content: '市場預期維持利率不變，但關注點在於點陣圖是否釋出年內降息訊號。建議決議前減少槓桿部位。',
    date: '2026-04-23',
  },
  {
    id: 'n4',
    category: 'direction',
    title: '航運股短線獲利了結',
    content: '貨櫃三雄近兩週漲幅已達 12-15%，短線乖離偏大。建議分批獲利了結，等待運價數據確認後再行佈局。',
    date: '2026-04-22',
  },
  {
    id: 'n5',
    category: 'indicator',
    title: '外資連三日買超台股',
    content: '外資本週累計買超 285 億元，主要集中在半導體與金融權值股，為近一個月最大單週買超。',
    date: '2026-04-21',
  },
];
</script>

<template>
  <DefaultLayout title="市場行情" subtitle="當前股市即時行情">
    <!-- 加權指數 -->
    <section class="flex flex-col gap-3">
      <div v-if="error" class="flex items-center justify-between rounded-xl bg-brand-muted px-4 py-2">
        <p class="text-xs text-muted-foreground">指數載入失敗：{{ error.message }}</p>
        <button
          class="flex items-center gap-1 text-xs font-medium text-brand transition hover:opacity-80"
          :disabled="loading"
          @click="refresh"
        >
          <RefreshCw :size="12" :stroke-width="2" :class="loading ? 'animate-spin' : ''" />
          <span>重試</span>
        </button>
      </div>

      <MarketIndexCard :data="index ?? null" :loading="loading" />
    </section>

    <!-- Tab 區域 -->
    <Tabs default-value="reports">
      <TabsList>
        <TabsTrigger value="reports">選股週報</TabsTrigger>
        <TabsTrigger value="notes">投資記事</TabsTrigger>
      </TabsList>

      <TabsContent value="reports" class="flex flex-col gap-3">
        <!-- 載入中骨架 -->
        <template v-if="reportsLoading">
          <Card v-for="i in 2" :key="i">
            <CardHeader class="pb-2">
              <div class="flex items-center gap-3">
                <Skeleton class="h-10 w-10 rounded-2xl" />
                <div class="flex flex-col gap-1.5">
                  <Skeleton class="h-4 w-32" />
                  <Skeleton class="h-3 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton class="mb-3 h-12 w-full" />
              <div class="flex gap-1.5">
                <Skeleton class="h-5 w-12 rounded-full" />
                <Skeleton class="h-5 w-14 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </template>

        <!-- 錯誤狀態 -->
        <div v-else-if="reportsError" class="flex items-center justify-center rounded-xl bg-brand-muted px-4 py-6">
          <p class="text-sm text-muted-foreground">週報載入失敗：{{ reportsError.message }}</p>
        </div>

        <!-- 週報列表 -->
        <template v-else-if="reportsData?.reports?.length">
          <ReportCard
            v-for="report in reportsData.reports"
            :key="report.id"
            :report="report"
            :is-unread="!readIds.includes(report.id)"
          />
        </template>

        <!-- 空狀態 -->
        <div v-else class="flex items-center justify-center rounded-xl bg-muted/50 px-4 py-8">
          <p class="text-sm text-muted-foreground">尚無週報資料</p>
        </div>
      </TabsContent>

      <TabsContent value="notes" class="flex flex-col gap-3">
        <NoteCard v-for="note in notes" :key="note.id" :note="note" />
      </TabsContent>
    </Tabs>
  </DefaultLayout>
</template>
