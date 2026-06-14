import type {
  CreateUserAddressRequest,
  UpdateUserAddressRequest,
} from "../lib/api/types/user-address";
import { toast } from "react-hot-toast";
import { userAddressService } from "../lib/api/services/user-address";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// query keys
export const userAddressKeys = {
  all: ["user-addresses"] as const,
  lists: () => [...userAddressKeys.all, "list"] as const,
  list: (filters: string) => [...userAddressKeys.lists(), { filters }] as const,
  details: () => [...userAddressKeys.all, "detail"] as const,
  detail: (id: number) => [...userAddressKeys.details(), id] as const,
};

// get all user addresses
export const useUserAddresses = () => {
  return useQuery({
    queryKey: userAddressKeys.lists(),
    queryFn: userAddressService.getUserAddresses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// get single user address by id
export const useUserAddress = (userAddressId: number) => {
  return useQuery({
    queryKey: userAddressKeys.detail(userAddressId),
    queryFn: () => userAddressService.getUserAddressById(userAddressId),
    enabled: !!userAddressId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// create new user address
export const useCreateUserAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserAddressRequest) =>
      userAddressService.createUserAddress(data),
    onSuccess: () => {
      toast.success("Alamat berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: userAddressKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan alamat: ${error.message}`);
    },
  });
};

// update user address by id
export const useUpdateUserAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateUserAddressRequest;
    }) => userAddressService.updateUserAddress(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Alamat berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: userAddressKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userAddressKeys.detail(id) });
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui alamat: ${error.message}`);
    },
  });
};

// delete user address by id
export const useDeleteUserAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userAddressId: number) =>
      userAddressService.deleteUserAddress(userAddressId),
    onSuccess: (_, userAddressId) => {
      queryClient.invalidateQueries({ queryKey: userAddressKeys.lists() });
      queryClient.removeQueries({
        queryKey: userAddressKeys.detail(userAddressId),
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus alamat: ${error.message}`);
    },
  });
};
