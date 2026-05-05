/**
 * 收益記錄頁面資料組合式函式
 * 整合 API 查詢、圖表資料聚合、年度目標進度計算
 * 取代原本的 useMockRecords
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';
import {
  useProfitRecordsQuery,
  useYearProfitRecordsQuery,
  useCreateProfitRecord,
  useDeleteProfitRecord,
} from '@/composables/module/useProfitRecordsQuery';
import {
  useYearlyGoalsQuery,
  useUpsertYearlyGoal,
} from '@/composables/module/useYearlyGoalsQuery';
import type {
  ProfitRecord,
  ProfitRecordForm,
  PieDataItem,
  BarDataItem,
  GoalProgress,
} from '@/types/module/records';

interface UseRecordsDataReturn {
  /** 當月篩選後的記錄 */
  filteredRecords: ComputedRef<ProfitRecord[]>;
  /** 圓餅圖資料 */
  pieData: ComputedRef<PieDataItem[]>;
  /** 長條圖資料 */
  barData: ComputedRef<BarDataItem[]>;
  /** 年度總損益 */
  yearTotal: ComputedRef<number>;
  /** 當月總損益 */
  monthTotal: ComputedRef<number>;
  /** 可選年份 */
  availableYears: ComputedRef<number[]>;
  /** 選中年份 */
  selectedYear: Ref<number>;
  /** 選中月份 */
  selectedMonth: Ref<number>;
  /** 年度目標進度 */
  goalProgress: ComputedRef<GoalProgress | null>;
  /** 新增記錄 */
  addRecord: (form: ProfitRecordForm) => void;
  /** 刪除記錄 */
  removeRecord: (id: string) => void;
  /** 設定年度目標 */
  setYearlyGoal: (year: number, amount: number) => void;
  /** 列表載入中 */
  isLoading: ComputedRef<boolean>;
  /** 新增中 */
  isCreating: ComputedRef<boolean>;
}

export function useRecordsData(): UseRecordsDataReturn {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const selectedYear = ref<number>(currentYear);
  const selectedMonth = ref<number>(currentMonth);

  /* ── 查詢：當月記錄 ── */
  const monthRef = computed(() => selectedMonth.value);
  const { data: monthData, isLoading: monthLoading } = useProfitRecordsQuery(
    selectedYear,
    monthRef,
  );

  /* ── 查詢：年度全部記錄（長條圖用） ── */
  const { data: yearData, isLoading: yearLoading } = useYearProfitRecordsQuery(selectedYear);

  /* ── 查詢：年度目標 ── */
  const { data: goalsData } = useYearlyGoalsQuery(selectedYear);

  /* ── Mutations ── */
  const createMutation = useCreateProfitRecord();
  const deleteMutation = useDeleteProfitRecord();
  const goalMutation = useUpsertYearlyGoal();

  /* ── 衍生資料 ── */

  const isLoading = computed((): boolean => monthLoading.value || yearLoading.value);
  const isCreating = computed((): boolean => createMutation.isPending.value);

  /** 當月記錄列表 */
  const filteredRecords = computed((): ProfitRecord[] =>
    monthData.value?.records ?? [],
  );

  /** 年度全部記錄 */
  const yearRecords = computed((): ProfitRecord[] =>
    yearData.value?.records ?? [],
  );

  /** 可選年份（從年度資料提取，至少包含當年） */
  const availableYears = computed((): number[] => {
    const years = new Set<number>([currentYear]);
    for (const r of yearRecords.value) {
      years.add(r.year);
    }
    return [...years].sort((a, b) => b - a);
  });

  /** 圓餅圖：當月各股票獲利佔比（僅正值） */
  const pieData = computed((): PieDataItem[] => {
    const map = new Map<string, number>();
    for (const r of filteredRecords.value) {
      if (r.profitLoss > 0) {
        map.set(r.stockName, (map.get(r.stockName) ?? 0) + r.profitLoss);
      }
    }
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  });

  /** 長條圖：年度 1-12 月總損益 */
  const barData = computed((): BarDataItem[] => {
    const monthMap = new Map<number, number>();
    for (const r of yearRecords.value) {
      monthMap.set(r.month, (monthMap.get(r.month) ?? 0) + r.profitLoss);
    }
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: monthMap.get(i + 1) ?? 0,
    }));
  });

  /** 年度總損益 */
  const yearTotal = computed((): number =>
    yearRecords.value.reduce((sum, r) => sum + r.profitLoss, 0),
  );

  /** 當月總損益 */
  const monthTotal = computed((): number =>
    filteredRecords.value.reduce((sum, r) => sum + r.profitLoss, 0),
  );

  /** 年度目標進度 */
  const goalProgress = computed((): GoalProgress | null => {
    const goals = goalsData.value?.goals ?? [];
    const goal = goals.find((g) => g.year === selectedYear.value);
    if (!goal || goal.targetAmount <= 0) return null;

    const current = yearTotal.value;
    const percentage = Math.min(Math.max((current / goal.targetAmount) * 100, 0), 100);
    const remaining = goal.targetAmount - current;

    return {
      targetAmount: goal.targetAmount,
      currentAmount: current,
      percentage,
      remaining,
    };
  });

  /** 新增記錄 */
  function addRecord(form: ProfitRecordForm): void {
    createMutation.mutate(form);
  }

  /** 刪除記錄 */
  function removeRecord(id: string): void {
    deleteMutation.mutate(id);
  }

  /** 設定年度目標 */
  function setYearlyGoal(year: number, amount: number): void {
    goalMutation.mutate({ year, targetAmount: amount });
  }

  return {
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
    removeRecord,
    setYearlyGoal,
    isLoading,
    isCreating,
  };
}
