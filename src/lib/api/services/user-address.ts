import { apiClient } from "./../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
  UserAddress,
  CreateUserAddressRequest,
  UserAddressResponse,
  SingleUserAddressResponse,
  UpdateUserAddressRequest,
  DeleteUserAddressResponse,
} from "../types/user-address";

export const userAddressService = {
  // get all user addresses
  async getUserAddresses(): Promise<UserAddress[]> {
    try {
      const response = await apiClient.get<UserAddressResponse>(
        "/api/user-addresses",
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // get single user address by id
  async getUserAddressById(userAddressId: number): Promise<UserAddress> {
    try {
      const response = await apiClient.get<SingleUserAddressResponse>(
        `/api/user-addresses/${userAddressId}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // create new user address
  async createUserAddress(
    data: CreateUserAddressRequest,
  ): Promise<UserAddress> {
    try {
      const response = await apiClient.post<SingleUserAddressResponse>(
        "/api/user-addresses",
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // update user address by id
  async updateUserAddress(
    userAddressId: number,
    data: UpdateUserAddressRequest,
  ): Promise<UserAddress> {
    try {
      const response = await apiClient.patch<SingleUserAddressResponse>(
        `/api/user-addresses/${userAddressId}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // delete user address by id
  async deleteUserAddress(userAddressId: number): Promise<void> {
    try {
      await apiClient.delete<DeleteUserAddressResponse>(
        `/api/user-addresses/${userAddressId}`,
      );
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
