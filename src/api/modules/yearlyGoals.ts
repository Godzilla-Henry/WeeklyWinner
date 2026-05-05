/**
 * 年度目標 API（需認證）
 */

import { http } from '@/api/http';
import type { YearlyGoalsResponse, YearlyGoalResponse } from '@/types/api';

/** 取得年度目標列表 */
export function getYearlyGoals(year?: number): Promise<YearlyGoalsResponse> {
  const qs = year !== undefined ? `?year=${year}` : '';
  return http.get<YearlyGoalsResponse>(`/yearly-goals${qs}`);
}

/** 設定或更新年度目標（Upsert） */
export function upsertYearlyGoal(
  year: number,
  targetAmount: number,
): Promise<YearlyGoalResponse> {
  return http.put<YearlyGoalResponse>(`/yearly-goals/${year}`, {
    target_amount: targetAmount,
  });
}
