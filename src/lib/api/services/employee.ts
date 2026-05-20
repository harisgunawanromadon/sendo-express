import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
  EmployeeBranch,
  EmployeeBranchResponse,
  SingleEmployeeBranchResponse,
  UpdateEmployeeBranchRequest,
  DeleteEmployeeBranchResponse,
  CreateEmployeeBranchRequest,
  EmployeeBranchFilters,
} from "../types/employee";

export const employeeService = {
  // get all employess branches
  async getAllEmployeeBranch(
    filters?: EmployeeBranchFilters,
  ): Promise<{ data: EmployeeBranch[]; paging: EmployeeBranchResponse["paging"] }> {
    try {
      const response = await apiClient.get<EmployeeBranchResponse>(
        "/api/employee-branches",
        { params: filters },
      );
      return { data: response.data.data, paging: response.data.paging };
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // create employee branch
  async createEmployeeBranch(
    data: CreateEmployeeBranchRequest,
  ): Promise<EmployeeBranch> {
    try {
      const response = await apiClient.post<SingleEmployeeBranchResponse>(
        "/api/employee-branches",
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // update employee branch
  async updateEmployeeBranch(
    employeeBranchId: number,
    data: UpdateEmployeeBranchRequest,
  ): Promise<EmployeeBranch> {
    try {
      const response = await apiClient.patch<SingleEmployeeBranchResponse>(
        `/api/employee-branches/${employeeBranchId}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // get single employee branch
  async getEmployeeBranchById(employeeBranchId: number): Promise<EmployeeBranch> {
    try {
      const response = await apiClient.get<SingleEmployeeBranchResponse>(
        `/api/employee-branches/${employeeBranchId}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // delete employee branch
  async deleteEmployeeBranch(employeeBranchId: number): Promise<void> {
    try {
      await apiClient.delete<DeleteEmployeeBranchResponse>(
        `/api/employee-branches/${employeeBranchId}`,
      );
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
