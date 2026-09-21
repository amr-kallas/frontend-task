export type APIListParams = {
  PageNumber?: number;
  PageSize?: number;
};

export type IPaginationResponse<T> = {
  pageNumber: number;
  totalPages: number;
  totalDataCount: number;
  data: T[];
};
