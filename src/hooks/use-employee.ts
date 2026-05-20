import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../lib/api/services/employee";
import type {
  CreateEmployeeBranchRequest,
  UpdateEmployeeBranchRequest,
  EmployeeBranchFilters,
} from "../lib/api/types/employee";

// query keys
export const employeeKeys = {
  all: ["employee"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters?: EmployeeBranchFilters) =>
    [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
};

// get all employee branches
export const useEmployees = (filters?: EmployeeBranchFilters) => {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => employeeService.getAllEmployeeBranch(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
  });
};

// create employee branch
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeBranchRequest) =>
      employeeService.createEmployeeBranch(data),
    onSuccess: () => {
      toast.success("Karyawan berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan karyawan!: ${error.message}`);
    },
  });
};

// update employee branch
export const useUpdateEmployee = (employeeBranchId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployeeBranchRequest) =>
      employeeService.updateEmployeeBranch(employeeBranchId, data),
    onSuccess: () => {
      toast.success("Karyawan berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui karyawan!: ${error.message}`);
    },
  });
};

// delete employee branch
export const useDeleteEmployee = (employeeBranchId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => employeeService.deleteEmployeeBranch(employeeBranchId),
    onSuccess: () => {
      toast.success("Karyawan berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.removeQueries({
        queryKey: employeeKeys.detail(employeeBranchId),
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus karyawan!: ${error.message}`);
    },
  });
};
