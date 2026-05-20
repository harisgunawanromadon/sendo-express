// Branch related types
import type { ApiMeta, Pagination } from "./index";

export interface BranchFilters {
  name?: string;
  page?: number;
  limit?: number;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  phoneNumber: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
}

export interface BranchResponse {
  meta: ApiMeta;
  data: Branch[];
  paging: Pagination;
}

export interface SingleBranchResponse {
  meta: ApiMeta;
  data: Branch;
}

// Legacy types for backward compatibility
export type BranchRequest = CreateBranchRequest;
