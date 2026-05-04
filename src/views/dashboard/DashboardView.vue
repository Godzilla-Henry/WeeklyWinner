<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import { useInvestNotesQuery } from '@/composables/module/useInvestNoteQuery';
import { useReadStatusQuery, useUnreadCountsQuery } from '@/composables/module/useUnreadQuery';

const route = useRoute();
const router = useRouter();

/* ── Tab 狀態持久化 ── */
const VALID_TABS = ['reports', 'notes'] as const;
type TabValue = (typeof VALID_TABS)[number];

function getInitialTab(): TabValue {
  const q = route.query.tab;
  const val = typeof q === 'string' ? q : '';
  return (VALID_TABS as readonly string[]).includes(val) ? (val as TabValue) : 'reports';
}

const activeTab = ref<TabValue>(getInitialTab());

watch(activeTab, (tab) => {
  void router.replace({ query: { ...route.query, tab: tab === 'reports' ? undefined : tab } });
});

/* ── 加權指數 ── */
const { index, loading, error, refresh } = useMarketIndex();

/* ── 未讀數量（Tab Badge） ── */
const { data: unreadData } = useUnreadCountsQuery();
const reportUnread = computed((): number => {
  const counts = unreadData.value?.counts;
  return counts ? ((counts as Record<string, number>)['weeklyReport'] ?? 0) : 0;
});
const noteUnread = computed((): number => {
  const counts = unreadData.value?.counts;
  return counts ? ((counts as Record<string, number>)['investNote'] ?? 0) : 0;
});

/* ── 週報列表 ── */
const page = ref(1);
const { data: reportsData, isLoading: reportsLoading, error: reportsError } = useReportsQuery(page);
const { data: reportReadStatus } = useReadStatusQuery('weekly_report');
const reportReadIds = computed((): string[] => reportReadStatus.value?.readIds ?? []);

/* ── 投資記事列表 ── */
const notePage = ref(1);
const { data: notesData, isLoading: notesLoading, error: notesError } = useInvestNotesQuery(notePage);
const { data: noteReadStatus } = useReadStatusQuery('invest_note');
const noteReadIds = computed((): string[] => noteReadStatus.value?.readIds ?? []);
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
    <Tabs :model-value="activeTab" @update:model-value="activeTab = $event as TabValue">
      <TabsList>
        <TabsTrigger value="reports" class="relative">
          選股週報
          <span v-if="reportUnread > 0" class="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
            {{ reportUnread }}
          </span>
        </TabsTrigger>
        <TabsTrigger value="notes" class="relative">
          投資記事
          <span v-if="noteUnread > 0" class="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
            {{ noteUnread }}
          </span>
        </TabsTrigger>
      </TabsList>

      <!-- 選股週報 -->
      <TabsContent value="reports" class="flex flex-col gap-3">
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
          <ReportCard v-for="report in reportsData.reports" :key="report.id" :report="report" :is-unread="!reportReadIds.includes(report.id)" />
        </template>

        <!-- 空狀態 -->
        <div v-else class="flex items-center justify-center rounded-xl bg-muted/50 px-4 py-8">
          <p class="text-sm text-muted-foreground">尚無週報資料</p>
        </div>
      </TabsContent>

      <!-- 投資記事 -->
      <TabsContent value="notes" class="flex flex-col gap-3">
        <template v-if="notesLoading">
          <Card v-for="i in 3" :key="i">
            <CardHeader class="pb-2">
              <div class="flex items-center gap-3">
                <Skeleton class="h-10 w-10 rounded-2xl" />
                <div class="flex flex-col gap-1.5">
                  <Skeleton class="h-4 w-40" />
                  <Skeleton class="h-3 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton class="h-5 w-16 rounded-full" />
            </CardContent>
          </Card>
        </template>
        <div v-else-if="notesError" class="flex items-center justify-center rounded-xl bg-brand-muted px-4 py-6">
          <p class="text-sm text-muted-foreground">記事載入失敗：{{ notesError.message }}</p>
        </div>
        <template v-else-if="notesData?.notes?.length">
          <NoteCard v-for="n in notesData.notes" :key="n.id" :note="n" :is-unread="!noteReadIds.includes(n.id)" />
        </template>
        <div v-else class="flex items-center justify-center rounded-xl bg-muted/50 px-4 py-8">
          <p class="text-sm text-muted-foreground">尚無記事資料</p>
        </div>
      </TabsContent>
    </Tabs>
  </DefaultLayout>
</template>
