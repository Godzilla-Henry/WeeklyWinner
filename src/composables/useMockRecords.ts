/**
 * 收益記錄模擬資料
 * 提供月份損益紀錄，供圖表與表格使用
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type {
  ProfitRecord,
  ProfitRecordForm,
  PieDataItem,
  BarDataItem,
  YearlyGoal,
  GoalProgress,
} from '@/types/module/records';

/** 初始模擬資料 */
const MOCK_RECORDS: ProfitRecord[] = [
  { id: '1', year: 2026, month: 1, stockName: '台積電', profitLoss: 58000, note: '波段操作' },
  { id: '2', year: 2026, month: 1, stockName: '聯發科', profitLoss: 32000, note: '短線交易' },
  { id: '3', year: 2026, month: 1, stockName: '富邦金', profitLoss: -12000, note: '停損出場' },
  { id: '4', year: 2026, month: 2, stockName: '台積電', profitLoss: 45000, note: '除息行情' },
  { id: '5', year: 2026, month: 2, stockName: '長榮', profitLoss: 28000, note: '航運反彈' },
  { id: '6', year: 2026, month: 2, stockName: '大立光', profitLoss: -8500, note: '追高套牢' },
  { id: '7', year: 2026, month: 3, stockName: '台積電', profitLoss: 72000, note: 'AI 題材' },
  { id: '8', year: 2026, month: 3, stockName: '聯發科', profitLoss: 41000, note: '法說利多' },
  { id: '9', year: 2026, month: 3, stockName: '台塑化', profitLoss: -15000, note: '油價下跌' },
  { id: '10', year: 2026, month: 4, stockName: '台積電', profitLoss: 63000, note: '外資回補' },
  { id: '11', year: 2026, month: 4, stockName: '富邦金', profitLoss: 18000, note: '升息受惠' },
  { id: '12', year: 2026, month: 4, stockName: '長榮', profitLoss: -22000, note: '運價回落' },
  { id: '13', year: 2025, month: 10, stockName: '台積電', profitLoss: 55000, note: '季報利多' },
  { id: '14', year: 2025, month: 11, stockName: '聯發科', profitLoss: 38000, note: '新品發表' },
  { id: '15', year: 2025, month: 12, stockName: '台積電', profitLoss: 48000, note: '年底作帳' },
  { id: '16', year: 2025, month: 12, stockName: '富邦金', profitLoss: -9000, note: '獲利了結' },
];

/** 預設年度目標 */
const DEFAULT_GOALS: YearlyGoal[] = [
  { year: 2026, targetAmount: 300000 },
  { year: 2025, targetAmount: 250000 },
];

interface UseMockRecordsReturn {
  records: Ref<ProfitRecord[]>;
  filteredRecords: ComputedRef<ProfitRecord[]>;
  pieData: ComputedRef<PieDataItem[]>;
  barData: ComputedRef<BarDataItem[]>;
  yearTotal: ComputedRef<number>;
  monthTotal: ComputedRef<number>;
  availableYears: ComputedRef<number[]>;
  selectedYear: Ref<number>;
  selectedMonth: Ref<number>;
  goalProgress: ComputedRef<GoalProgress | null>;
  yearlyGoals: Ref<YearlyGoal[]>;
  addRecord: (form: ProfitRecordForm) => void;
  setYearlyGoal: (year: number, amount: number) => void;
}

export function useMockRecords(): UseMockRecordsReturn {
  const records = ref<ProfitRecord[]>([...MOCK_RECORDS]);
  const selectedYear = ref<number>(2026);
  const selectedMonth = ref<number>(4);
  const yearlyGoals = ref<YearlyGoal[]>([...DEFAULT_GOALS]);

  /** 可選年份（從資料中提取） */
  const availableYears = computed((): number[] => {
    const years = new Set(records.value.map((r) => r.year));
    return [...years].sort((a, b) => b - a);
  });

  /** 依年份 + 月份篩選 */
  const filteredRecords = computed((): ProfitRecord[] =>
    records.value.filter((r) => r.year === selectedYear.value && r.month === selectedMonth.value),
  );

  /** 圓餅圖：當月各股票損益佔比（僅取正值） */
  const pieData = computed((): PieDataItem[] => {
    const map = new Map<string, number>();
    for (const r of filteredRecords.value) {
      if (r.profitLoss > 0) {
        map.set(r.stockName, (map.get(r.stockName) ?? 0) + r.profitLoss);
      }
    }
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  });

  /** 長條圖：該年度 1-12 月總損益 */
  const barData = computed((): BarDataItem[] => {
    const monthMap = new Map<number, number>();
    for (const r of records.value.filter((r) => r.year === selectedYear.value)) {
      monthMap.set(r.month, (monthMap.get(r.month) ?? 0) + r.profitLoss);
    }
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: monthMap.get(i + 1) ?? 0,
    }));
  });

  /** 年度總損益 */
  const yearTotal = computed((): number =>
    records.value
      .filter((r) => r.year === selectedYear.value)
      .reduce((sum, r) => sum + r.profitLoss, 0),
  );

  /** 當月總損益 */
  const monthTotal = computed((): number =>
    filteredRecords.value.reduce((sum, r) => sum + r.profitLoss, 0),
  );

  /** 年度目標進度 */
  const goalProgress = computed((): GoalProgress | null => {
    const goal = yearlyGoals.value.find((g) => g.year === selectedYear.value);
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
    const newRecord: ProfitRecord = {
      id: String(Date.now()),
      ...form,
    };
    records.value = [newRecord, ...records.value];
  }

  /** 設定年度目標 */
  function setYearlyGoal(year: number, amount: number): void {
    const existing = yearlyGoals.value.findIndex((g) => g.year === year);
    if (existing >= 0) {
      yearlyGoals.value[existing] = { year, targetAmount: amount };
    } else {
      yearlyGoals.value = [...yearlyGoals.value, { year, targetAmount: amount }];
    }
  }

  return {
    records,
    filteredRecords,
    pieData,
    barData,
    yearTotal,
    monthTotal,
    availableYears,
    selectedYear,
    selectedMonth,
    goalProgress,
    yearlyGoals,
    addRecord,
    setYearlyGoal,
  };
}
