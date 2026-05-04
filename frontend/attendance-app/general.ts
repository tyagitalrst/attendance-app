export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  pageNo: number;
  pageSize: number;
}
