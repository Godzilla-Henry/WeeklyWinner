<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MarketIndexCard from './components/MarketIndexCard.vue';
import ReportCard from './components/ReportCard.vue';
import NoteCard from './components/NoteCard.vue';
import { useMarketIndex } from '@/composables/useMarketIndex';
import type { WeeklyReport, InvestNote } from './types';

const { index, loading, error, refresh } = useMarketIndex();

const reports: WeeklyReport[] = [
  {
    id: '0426',
    title: '04/26 選股週報',
    date: '2026-04-26',
    tags: ['均華', '中探針',],
    summary: '台積電技術論壇揭露A16至A12的埃米世代最新製程,相關設備廠務、先進測試、CPO等都是最大受惠,惟因短線漲多,漲幅乖離過大必然修正,看好拉回守穩再上。',
  },
  {
    id: '0419',               
    title: '04/19 選股週報',
    date: '2026-04-19',
    tags: ['營邦', '精測', '勤誠', '順達'],
    summary: 'AI 伺服器需求持續攀升，輝達新一代晶片帶動台系 ODM 廠訂單能見度延伸至 Q3，科技股維持偏多格局。',
  },
];

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
        <p class="text-xs text-muted-foreground">{{ error }}</p>
        <button
          class="flex items-center gap-1 text-xs font-medium text-brand transition hover:opacity-80"
          :disabled="loading"
          @click="refresh"
        >
          <RefreshCw :size="12" :stroke-width="2" :class="loading ? 'animate-spin' : ''" />
          <span>重試</span>
        </button>
      </div>

      <MarketIndexCard :data="index" :loading="loading" />
    </section>

    <!-- Tab 區域 -->
    <Tabs default-value="reports">
      <TabsList>
        <TabsTrigger value="reports">選股週報</TabsTrigger>
        <TabsTrigger value="notes">投資記事</TabsTrigger>
      </TabsList>

      <TabsContent value="reports" class="flex flex-col gap-3">
        <ReportCard v-for="report in reports" :key="report.id" :report="report" />
      </TabsContent>

      <TabsContent value="notes" class="flex flex-col gap-3">
        <NoteCard v-for="note in notes" :key="note.id" :note="note" />
      </TabsContent>
    </Tabs>
  </DefaultLayout>
</template>
