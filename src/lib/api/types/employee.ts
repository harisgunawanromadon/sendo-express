import type { ApiMeta, Pagination } from "./index";
import type { Role } from "@/lib/api/types/role";

// Employee related types

export interface EmployeeBranch {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: Role;
  };
  branch: {
    id: number;
    name: string;
  };
}

export interface CreateEmployeeBranchRequest {
  branchId: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  roleId: number;
  password: string;
  confirmPassword: string;
}

export interface UpdateEmployeeBranchRequest {
  branchId?: number;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  roleId?: number;
  password?: string;
  confirmPassword?: string;
}

export interface EmployeeBranchFilters {
  name?: string;
  email?: string;
  phoneNumber?: string;
  branchName?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeBranchResponse {
  meta: ApiMeta;
  data: EmployeeBranch[];
  paging: Pagination;
}

export interface SingleEmployeeBranchResponse {
  meta: ApiMeta;
  data: EmployeeBranch;
}

export interface DeleteEmployeeBranchResponse {
  meta: ApiMeta;
  data: null;
}
