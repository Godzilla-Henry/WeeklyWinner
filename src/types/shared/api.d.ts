/** API 通用回應結構 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 分頁資料結構 */
interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
