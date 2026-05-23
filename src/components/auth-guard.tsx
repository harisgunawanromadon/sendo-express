import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { usePermission } from "../hooks/use-permission";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredAuth: boolean;
  role?: string;
  roles?: string[];
  permissions?: string[];
  permission?: string;
  redirectTo?: string;
}

export const AuthGuard = ({
  children,
  requiredAuth = true,
  permissions,
  permission,
  role,
  roles,
  redirectTo = "/dashboard",
}: AuthGuardProps) => {
  const { isAuthenticated, isLoadingUser, user } = useAuth();
  const { hasPermission, hasAnyPermission } = usePermission();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingUser) {
      if (requiredAuth && !isAuthenticated) {
        navigate("/auth/login");
      } else if (!requiredAuth && isAuthenticated) {
        navigate("/dashboard");
      } else if (isAuthenticated) {
        let hasAccess = true;

        if (role || roles) {
          const userRole = typeof user?.role === "string" ? user.role : "";
          const allowedRoles = roles || (role ? [role] : []);
          hasAccess = allowedRoles.includes(userRole);
        }

        if (hasAccess && (permission || permissions)) {
          if (permission) {
            hasAccess = hasPermission(permission);
          } else if (permissions) {
            hasAccess = hasAnyPermission(permissions);
          }
        }

        if (!hasAccess) {
          navigate(redirectTo);
        }
      }
    }
  }, [
    isAuthenticated,
    isLoadingUser,
    requiredAuth,
    navigate,
    permissions,
    permission,
    role,
    roles,
    user,
    redirectTo,
    hasPermission,
    hasAnyPermission,
  ]);

  if (requiredAuth && !isAuthenticated) {
    return null;
  }

  if (!requiredAuth && isAuthenticated) {
    return null;
  }

  if (isAuthenticated) {
    let hasAccess = true;

    if (role || roles) {
      const userRole = typeof user?.role === "string" ? user.role : "";
      const allowedRoles = roles || (role ? [role] : []);
      hasAccess = allowedRoles.includes(userRole);
    }

    if (hasAccess && (permission || permissions)) {
      if (permission) {
        hasAccess = hasPermission(permission);
      } else if (permissions) {
        hasAccess = hasAnyPermission(permissions);
      }
    }

    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
};
