<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-vue-next';
import SelectionTable from './components/SelectionTable.vue';
import { getReportById } from './types';

const route = useRoute();
const router = useRouter();

const reportId = computed((): string => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] ?? '' : id;
});

const report = computed((): WeeklyReportDetail | undefined =>
  getReportById(reportId.value),
);

function goBack(): void {
  void router.push({ name: 'dashboard' });
}
</script>

<template>
  <DefaultLayout :wide="true">
    <template #header>
      <!-- 返回列 — 獨立於標題之上，輕量不搶焦 -->
      <nav class="flex items-center">
        <button
          class="-ml-2 flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          @click="goBack"
        >
          <ArrowLeft :size="15" :stroke-width="2" />
          <span>總覽</span>
        </button>
      </nav>

      <template v-if="report">
        <div class="mt-3">
          <h2 class="text-lg font-bold text-foreground">{{ report.title }}</h2>
          <p v-if="report.date" class="text-sm text-muted-foreground">{{ report.date }}</p>
      </div>
      </template>
    </template>

    <template v-if="report">
      <!-- 內容描述 -->
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
