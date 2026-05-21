<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MonthPieChart from './components/MonthPieChart.vue';
import YearBarChart from './components/YearBarChart.vue';
import RecordTable from './components/RecordTable.vue';
import GoalProgressCard from './components/GoalProgressCard.vue';
import AddRecordDialog from './dialogs/AddRecordDialog.vue';
import { useRecordsData } from '@/composables/module/useRecordsData';
import type { ProfitRecordForm } from '@/types/module/records';

const {
  filteredRecords,
  pieData,
  barData,
  yearTotal,
  monthTotal,
  availableYears,
  selectedYear,
  selectedMonth,
  goalProgress,
  addRecord,
  setYearlyGoal,
  isLoading,
} = useRecordsData();

/* ── 圖表 Tab 狀態 ── */
const chartTab = ref<'pie' | 'bar'>('pie');

/* ── 新增記錄 Dialog ── */
const dialogOpen = ref(false);

function handleAddRecord(form: ProfitRecordForm): void {
  addRecord(form);
}

function handleSetGoal(amount: number): void {
  setYearlyGoal(selectedYear.value, amount);
}

/** Select 需要 string 值，做轉換 */
const selectedYearStr = computed({
  get: () => String(selectedYear.value),
  set: (val: string) => { selectedYear.value = Number(val); },
});

const selectedMonthStr = computed({
  get: () => String(selectedMonth.value),
  set: (val: string) => { selectedMonth.value = Number(val); },
});

/** 月份選項 */
const months = Array.from({ length: 12 }, (_, i) => i + 1);

/** 格式化金額 */
function formatTotal(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toLocaleString()}`;
}
</script>

<template>
  <DefaultLayout
    title="收益記錄總覽"
    subtitle="追蹤每月投資損益與績效分析"
  >
    <!-- Header 操作列 -->
    <section class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex min-w-0 flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          class="shrink-0 border-brand bg-white text-xs font-semibold text-foreground shadow-sm"
        >
          年度 {{ formatTotal(yearTotal) }}
        </Badge>
        <Badge
          :variant="monthTotal >= 0 ? 'gain' : 'loss'"
          class="shrink-0 text-xs"
        >
          當月 {{ formatTotal(monthTotal) }}
        </Badge>
      </div>
      <button
        class="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-medium text-brand-foreground transition hover:opacity-90"
        @click="dialogOpen = true"
      >
        <Plus
          :size="14"
          :stroke-width="2"
        />
        <span>新增記錄</span>
      </button>
    </section>

    <!-- 年度目標進度 -->
    <section>
      <GoalProgressCard
        :progress="goalProgress"
        :year="selectedYear"
        @set-goal="handleSetGoal"
      />
    </section>

    <!-- Filter 篩選列 -->
    <section class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">年份</span>
        <Select v-model="selectedYearStr">
          <SelectTrigger class="w-24">
            <SelectValue>{{ selectedYear }}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="y in availableYears"
              :key="y"
              :value="String(y)"
            >
              {{ y }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">月份</span>
        <Select v-model="selectedMonthStr">
          <SelectTrigger class="w-24">
            <SelectValue>{{ selectedMonth }} 月</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="m in months"
              :key="m"
              :value="String(m)"
            >
              {{ m }} 月
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>

    <!-- Analysis 圖表區 -->
    <section>
      <Card>
        <CardContent class="p-4">
          <Tabs
            v-model="chartTab"
            class="w-full"
          >
            <TabsList class="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="pie">
                月份佔比
              </TabsTrigger>
              <TabsTrigger value="bar">
                年度走勢
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pie">
              <template v-if="isLoading">
                <div class="flex h-72 items-center justify-center">
                  <Skeleton class="h-48 w-48 rounded-full" />
                </div>
              </template>
              <MonthPieChart
                v-else
                :data="pieData"
              />
            </TabsContent>
            <TabsContent value="bar">
              <template v-if="isLoading">
                <div class="flex h-64 items-end justify-between gap-2 px-4">
                  <Skeleton
                    v-for="i in 12"
                    :key="i"
                    class="w-full"
                    :style="{ height: `${Math.random() * 60 + 20}%` }"
                  />
                </div>
              </template>
              <YearBarChart
                v-else
                :data="barData"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>

    <!-- Data List 表格區 -->
    <section class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold text-foreground">
        {{ selectedYear }} 年 {{ selectedMonth }} 月明細
      </h3>
      <template v-if="isLoading">
        <div class="flex flex-col gap-2">
          <Skeleton
            v-for="i in 3"
            :key="i"
            class="h-12 w-full rounded-lg"
          />
        </div>
      </template>
      <RecordTable
        v-else
        :records="filteredRecords"
      />
    </section>

    <!-- 新增記錄 Dialog -->
    <AddRecordDialog
      :open="dialogOpen"
      :default-year="selectedYear"
      :default-month="selectedMonth"
      @update:open="dialogOpen = $event"
      @submit="handleAddRecord"
    />
  </DefaultLayout>
</template>
