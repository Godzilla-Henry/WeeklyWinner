/**
 * 週報 API
 */

import { http } from '@/api/http';
import type { ReportsResponse, ReportDetailResponse } from '@/types/api';

/** 取得週報列表 */
export function getReports(
  idToken: string,
  page = 1,
  limit = 20,
): Promise<ReportsResponse> {
  return http.get<ReportsResponse>(`/reports?page=${page}&limit=${limit}`, idToken);
}

/** 取得週報詳情（含選股標的） */
export function getReportDetail(
  idToken: string,
  reportId: string,
): Promise<ReportDetailResponse> {
  return http.get<ReportDetailResponse>(`/reports/${reportId}`, idToken);
}
