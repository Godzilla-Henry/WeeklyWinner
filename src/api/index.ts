/**
 * API 統一匯出
 */

export { login } from './modules/auth';
export { getReports, getReportDetail } from './modules/report';
export { getInvestNotes, getInvestNoteDetail } from './modules/investNote';
export { getUnreadCounts, getUnreadCount, getReadStatus, markAsRead } from './modules/unread';
export { fetchTaiex } from './modules/stock';
export {
  getProfitRecords,
  createProfitRecord,
  updateProfitRecord,
  deleteProfitRecord,
} from './modules/profitRecords';
export { getYearlyGoals, upsertYearlyGoal } from './modules/yearlyGoals';
export { queryKeys } from './queryKeys';
