export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiListResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
};
