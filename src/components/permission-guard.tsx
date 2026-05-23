import { type ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";
import { Skeleton } from "./ui/skeleton";

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  permission,
  permissions,
  role,
  roles,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, isLoading, user } = usePermission();

  if (isLoading && (permission || permissions)) {
    return <Skeleton className="h-10" />;
  }

  if (role || roles) {
    const userRole = typeof user?.role === "string" ? user.role : "";
    const allowedRoles = roles || (role ? [role] : []);
    const hasRole = allowedRoles.includes(userRole);

    if (!hasRole) return <>{fallback}</>;
    
    if (!permission && !permissions) return <>{children}</>;
  }

  if (permission) {
    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
  }

  if (permissions) {
    return hasAnyPermission(permissions) ? <>{children}</> : <>{fallback}</>;
  }

  if (!permission && !permissions && !role && !roles) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default PermissionGuard;
