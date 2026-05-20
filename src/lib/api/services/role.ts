import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
  Role,
  UpdateRoleRequest,
  RoleResponse,
  SingleRoleResponse,
  UpdateRoleResponse,
} from "../types/role";

const ROLE_KEY_TO_ID: Record<string, number> = {
  "super-admin": 1,
  customer: 2,
  courier: 3,
  "admin-branch": 4,
};

export const roleService = {
  async getRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get<RoleResponse>("/api/roles");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  async getRoleById(id: number): Promise<Role> {
    try {
      const response = await apiClient.get<SingleRoleResponse>(
        `/api/roles/${id}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  async getRoleByKey(roleKey: string): Promise<Role> {
    const roleId = ROLE_KEY_TO_ID[roleKey];
    if (!roleId) throw new Error(`Unknown role key: ${roleKey}`);
    return roleService.getRoleById(roleId);
  },

  async updateRolePermissions(
    id: number,
    data: UpdateRoleRequest,
  ): Promise<Role> {
    try {
      const response = await apiClient.patch<UpdateRoleResponse>(
        `/api/roles/${id}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
