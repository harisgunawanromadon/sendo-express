import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { roleService } from "@/lib/api/services/role";
import { permissionService } from "@/lib/api/services/permission";
import type { Permissions } from "@/lib/api/types/role";

export const usePermission = () => {
  const { user } = useAuth();

  // Ambil permissions user berdasarkan role key
  const { data: userRole, isLoading } = useQuery({
    queryKey: ["roles", "by-key", user?.role],
    queryFn: () => roleService.getRoleByKey(user!.role),
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  const userPermissions: Permissions[] = userRole?.permissions ?? [];

  const hasPermission = (permissionKey: string): boolean => {
    if (!user) return false;
    if (isLoading) return false;
    return userPermissions.some((p) => p.key === permissionKey);
  };

  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    return permissionKeys.some((key) => hasPermission(key));
  };

  const hasAllPermission = (permissionKeys: string[]): boolean => {
    return permissionKeys.every((key) => hasPermission(key));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
    isLoading,
    userPermissions,
  };
};

export const usePermissionApi = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => permissionService.getPermissions(),
    staleTime: 10 * 60 * 1000,
  });
};

