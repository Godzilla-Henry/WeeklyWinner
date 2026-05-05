/** 收益記錄型別定義 */

/** 單筆收益記錄 */
export interface ProfitRecord {
  id: string;
  year: number;
  month: number;
  stockName: string;
  profitLoss: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

/** 新增收益記錄表單（送出時需轉 snake_case） */
export interface ProfitRecordForm {
  year: number;
  month: number;
  stockName: string;
  profitLoss: number;
  note: string;
}

/** 圓餅圖資料項 */
export interface PieDataItem {
  name: string;
  value: number;
}

/** 長條圖月份資料 */
export interface BarDataItem {
  month: number;
  value: number;
}

/** 年度目標 */
export interface YearlyGoal {
  id: string;
  year: number;
  targetAmount: number;
  createdAt: string;
  updatedAt: string;
}

/** 目標進度 */
export interface GoalProgress {
  targetAmount: number;
  currentAmount: number;
  percentage: number;
  remaining: number;
}
