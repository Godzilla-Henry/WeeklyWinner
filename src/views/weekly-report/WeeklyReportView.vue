<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-vue-next';
import SelectionTable from './components/SelectionTable.vue';
import { useReportDetailQuery } from '@/composables/module/useReportQuery';
import { useMarkAsReadMutation } from '@/composables/module/useUnreadQuery';
import { useIsLiffLoggedIn } from '@/composables/shared/useLiffToken';

const route = useRoute();
const router = useRouter();

const reportId = computed((): string => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] ?? '' : id;
});

/* ── 週報詳情 API ── */
const { data, isLoading, error } = useReportDetailQuery(reportId);
const report = computed(() => data.value?.report);

/* ── 自動標記已讀 ── */
const isLoggedIn = useIsLiffLoggedIn();
const { mutate: markRead } = useMarkAsReadMutation();

watch(
  () => data.value?.ok,
  (ok) => {
    if (ok && reportId.value && isLoggedIn.value) {
      markRead({ contentType: 'weekly_report', contentId: reportId.value });
    }
  },
);

function goBack(): void {
  void router.push({ name: 'dashboard' });
}
</script>

<template>
  <DefaultLayout :wide="true">
    <template #header>
      <!-- 返回列 -->
      <nav class="flex items-center">
        <button
          class="-ml-2 flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          @click="goBack"
        >
          <ArrowLeft :size="15" :stroke-width="2" />
          <span>總覽</span>
        </button>
      </nav>

      <!-- 標題骨架 -->
      <div v-if="isLoading" class="mt-3 flex flex-col gap-2">
        <Skeleton class="h-6 w-40" />
        <Skeleton class="h-4 w-24" />
      </div>

      <template v-else-if="report">
        <div class="mt-3">
          <h2 class="text-lg font-bold text-foreground">{{ report.title }}</h2>
          <p v-if="report.date" class="text-sm text-muted-foreground">{{ report.date }}</p>
        </div>
      </template>
    </template>

    <!-- 載入中骨架 -->
    <template v-if="isLoading">
      <Card>
        <CardContent class="flex flex-col gap-4 p-6">
          <Skeleton class="h-5 w-full" />
          <Skeleton class="h-5 w-4/5" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
          <div class="flex gap-1.5">
            <Skeleton class="h-5 w-12 rounded-full" />
            <Skeleton class="h-5 w-14 rounded-full" />
          </div>
        </CardContent>
      </Card>
      <section class="flex flex-col gap-3">
        <Skeleton class="h-4 w-20" />
        <Card>
          <CardContent class="flex flex-col gap-3 p-5">
            <Skeleton class="h-16 w-full" />
            <Skeleton class="h-16 w-full" />
          </CardContent>
        </Card>
      </section>
    </template>

    <!-- 錯誤狀態 -->
    <Card v-else-if="error">
      <CardContent class="flex flex-col items-center justify-center gap-4 p-12">
        <p class="text-lg font-medium text-muted-foreground">載入失敗</p>
        <p class="text-sm text-muted-foreground">{{ error.message }}</p>
        <button
          class="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
          @click="goBack"
        >
          返回總覽
        </button>
      </CardContent>
    </Card>

    <!-- 週報內容 -->
    <template v-else-if="report">
      <Card>
        <CardContent class="flex flex-col gap-4 p-6">
          <p class="text-base font-medium leading-relaxed text-foreground">
            {{ report.summary }}
          </p>
          <p class="text-sm leading-7 text-muted-foreground">
            {{ report.content }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            <Badge v-for="tag in report.tags" :key="tag" variant="brand">
              {{ tag }}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- 選股標的表格 -->
      <section class="flex flex-col gap-3">
        <p class="text-sm font-medium text-muted-foreground">選股標的</p>
        <SelectionTable :selections="report.selections" />
      </section>
    </template>

    <!-- 找不到週報 -->
    <Card v-else>
      <CardContent class="flex flex-col items-center justify-center gap-4 p-12">
        <p class="text-lg font-medium text-muted-foreground">找不到此週報</p>
        <button
          class="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
          @click="goBack"
        >
          返回總覽
        </button>
      </CardContent>
    </Card>
  </DefaultLayout>
</template>
