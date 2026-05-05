/**
 * 收益記錄 API（需認證）
 */

import { http } from '@/api/http';
import type {
  ProfitRecordsResponse,
  ProfitRecordResponse,
} from '@/types/api';
import type { ProfitRecordForm } from '@/types/module/records';

/** 取得收益記錄列表（支援年月篩選） */
export function getProfitRecords(
  year?: number,
  month?: number,
): Promise<ProfitRecordsResponse> {
  const params = new URLSearchParams();
  if (year !== undefined) params.set('year', String(year));
  if (month !== undefined) params.set('month', String(month));
  const qs = params.toString();
  return http.get<ProfitRecordsResponse>(`/profit-records${qs ? `?${qs}` : ''}`);
}

/** 新增收益記錄 */
export function createProfitRecord(form: ProfitRecordForm): Promise<ProfitRecordResponse> {
  return http.post<ProfitRecordResponse>('/profit-records', {
    year: form.year,
    month: form.month,
    stock_name: form.stockName,
    profit_loss: form.profitLoss,
    note: form.note || '',
  });
}

/** 更新收益記錄 */
export function updateProfitRecord(
  id: string,
  form: Partial<ProfitRecordForm>,
): Promise<ProfitRecordResponse> {
  const body: Record<string, unknown> = {};
  if (form.year !== undefined) body.year = form.year;
  if (form.month !== undefined) body.month = form.month;
  if (form.stockName !== undefined) body.stock_name = form.stockName;
  if (form.profitLoss !== undefined) body.profit_loss = form.profitLoss;
  if (form.note !== undefined) body.note = form.note;
  return http.put<ProfitRecordResponse>(`/profit-records/${id}`, body);
}

/** 刪除收益記錄 */
export function deleteProfitRecord(id: string): Promise<{ ok: boolean }> {
  return http.delete<{ ok: boolean }>(`/profit-records/${id}`);
}
