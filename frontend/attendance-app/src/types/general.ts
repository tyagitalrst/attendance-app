export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  pageNo: number;
  pageSize: number;
}

export interface FilterPagination {
  pageNo?: number;
  pageSize?: number;
}
