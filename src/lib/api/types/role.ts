// Role and Permission related types

export interface ApiMeta {
  message: string;
  statusCode: number;
  success: boolean; 
}

export interface Permissions {
  id: number;
  name: string;
  key: string;
  resource: string;
}
export interface Role {
  id: number;
  name: string;
  key: string;
  permissions: Permissions[];
}

export interface RoleResponse {
  meta: ApiMeta;
  data: Role[];
}

export interface SingleRoleResponse {
  meta: ApiMeta;
  data: Role;
}

export interface UpdateRoleRequest {
  permissionIds: number[];
}

export interface UpdateRoleResponse {
  meta: ApiMeta;
  data: Role;
}
