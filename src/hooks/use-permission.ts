import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { roleService } from "@/lib/api/services/role";
import type { Permissions } from "@/lib/api/types/role";
import { permissionService } from "@/lib/api/services/permission";

export const usePermission = () => {
  const { user } = useAuth();

  const roleKey =
    typeof user?.role === "object"
      ? (user?.role as { key: string })?.key
      : user?.role;

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => roleService.getRoles(),
    enabled: !!roleKey,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const userPermissions: Permissions[] = (() => {
    if (!roleKey || !roles) return [];

    const activeRole = roles.find((r) => r.key === roleKey);
    return activeRole?.permissions ?? [];
  })();

  const hasPermission = (permissionKey: string): boolean => {
    if (!user) return false;
    return userPermissions.some((p) => p.key === permissionKey);
  };

  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    return permissionKeys.some((key) => hasPermission(key));
  };

  const hasAllPermission = (permissionKeys: string[]): boolean => {
    return permissionKeys.every((key) => hasPermission(key));
  };

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
    isLoading,
    userPermissions,
  };
};

export const usePermissionApi = () => {
  return useQuery({
    queryKey: ["permissions", "all"],
    queryFn: () => permissionService.getPermissions(),
    staleTime: 10 * 60 * 1000,
  });
};
