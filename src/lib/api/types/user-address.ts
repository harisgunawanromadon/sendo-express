import type { ApiMeta, Pagination } from "./index";

export interface CreateUserAddressRequest {
  address: string;
  tag?: string;
  label?: string;
  photo?: string;
}

export interface UserAddressParams {
  address?: string;
  page?: number;
  limit?: number;
}

export interface UpdateUserAddressRequest {
  address: string;
  tag?: string;
  label?: string;
  photo?: string;
}

export interface UserAddress {
  id: number;
  address: string;
  tag?: string;
  label?: string;
  photo?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserAddressResponse {
  meta: ApiMeta;
  data: UserAddress[];
  paging: Pagination;
}

export interface SingleUserAddressResponse {
  meta: ApiMeta;
  data: UserAddress;
}

export interface UserAddressDetailResponse {
  meta: ApiMeta;
  data: UserAddress;
}

export interface DeleteUserAddressResponse {
  meta: ApiMeta;
  data: null;
}
