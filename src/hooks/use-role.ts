import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/lib/api/services/role";
import { toast } from "react-hot-toast";
import type { UpdateRoleRequest } from "@/lib/api/types/role";

export const useRoles = (name: string) => {
  return useQuery({
    queryKey: ["roles", name],
    queryFn: () => roleService.getRoles(name),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRoleById = (id: number) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => roleService.getRoleById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleRequest }) =>
      roleService.updateRolePermissions(id, data),
    onSuccess: (updatedRole) => {
      queryClient.setQueryData(["roles", updatedRole.id], updatedRole);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role berhasil diperbarui!");
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal memperbarui role. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};
