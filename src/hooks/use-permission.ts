import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { roleService } from "@/lib/api/services/role";
import { permissionService } from "@/lib/api/services/permission";
import type { Permissions } from "@/lib/api/types/role";

// Static fallback permissions berdasarkan data API docs
// Digunakan ketika non-SA tidak bisa hit GET /api/roles/{id} (403)
const ROLE_PERMISSIONS_FALLBACK: Record<string, Permissions[]> = {
  "admin-branch": [
    {
      id: 1,
      name: "Create Shipment",
      key: "shipments.create",
      resource: "shipments",
    },
    {
      id: 2,
      name: "Read Shipment",
      key: "shipments.read",
      resource: "shipments",
    },
    {
      id: 7,
      name: "Create Branch",
      key: "branches.create",
      resource: "branches",
    },
    { id: 8, name: "Read Branch", key: "branches.read", resource: "branches" },
    {
      id: 9,
      name: "Update Branch",
      key: "branches.update",
      resource: "branches",
    },
    {
      id: 10,
      name: "Delete Branch",
      key: "branches.delete",
      resource: "branches",
    },
    {
      id: 14,
      name: "Read Shipment Branch",
      key: "shipment-branch.read",
      resource: "shipment-branch",
    },
    {
      id: 15,
      name: "Input Shipment Branch",
      key: "shipment-branch.input",
      resource: "shipment-branch",
    },
  ],
  customer: [
    {
      id: 2,
      name: "Read Shipment",
      key: "shipments.read",
      resource: "shipments",
    },
    {
      id: 18,
      name: "Track Packages",
      key: "packages.track",
      resource: "packages",
    },
  ],
  courier: [
    {
      id: 12,
      name: "Read Delivery",
      key: "delivery.read",
      resource: "delivery",
    },
    {
      id: 13,
      name: "Update Delivery",
      key: "delivery.update",
      resource: "delivery",
    },
    {
      id: 18,
      name: "Track Packages",
      key: "packages.track",
      resource: "packages",
    },
    {
      id: 19,
      name: "Scan Packages",
      key: "packages.scan",
      resource: "packages",
    },
  ],
};

export const usePermission = () => {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "super-admin";

  const { data: allRoles, isLoading } = useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => roleService.getRoles(),
    enabled: !!user && isSuperAdmin,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  // Hitung permissions berdasarkan role
  const userPermissions: Permissions[] = (() => {
    if (!user) return [];

    if (isSuperAdmin) {
      // Ambil dari API (hanya SA yang bisa fetch)
      return allRoles?.find((r) => r.key === "super-admin")?.permissions ?? [];
    }

    return ROLE_PERMISSIONS_FALLBACK[user.role] ?? [];
  })();

  const hasPermission = (permissionKey: string): boolean => {
    if (!user) return false;
    if (isSuperAdmin && isLoading) return false;
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
    isLoading: isSuperAdmin ? isLoading : false,
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
