import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { branchService } from "@/lib/api/services/branch";
import { toast } from "react-hot-toast";
import type { BranchFilters, CreateBranchRequest } from "@/lib/api/types/branch";

// query keys
export const branchKeys = {
  all: ["branches"] as const,
  lists: () => [...branchKeys.all, "list"] as const,
  list: (filters?: BranchFilters) => [...branchKeys.lists(), { filters }] as const,
  details: () => [...branchKeys.all, "detail"] as const,
  detail: (id: number) => [...branchKeys.all, "details", id] as const,
};

// get all branches with optional filters
export const useBranches = (filters?: BranchFilters) => {
  return useQuery({
    queryKey: branchKeys.list(filters),
    queryFn: () => branchService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
  });
};

// get branch by id
export const useBranch = (id: number) => {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// create new branch
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranchRequest) => branchService.create(data),
    onSuccess: () => {
      toast.success("Cabang berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan cabang!: ${error.message}`);
    },
  });
};

// update branch
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateBranchRequest }) =>
      branchService.update(id, data),
    onSuccess: () => {
      toast.success("Cabang berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui cabang!: ${error.message}`);
    },
  });
};

// delete branch
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => branchService.delete(id),
    onSuccess: (_, deletedId) => {
      toast.success("Cabang berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.removeQueries({ queryKey: branchKeys.detail(deletedId) });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus cabang!: ${error.message}`);
    },
  });
};
