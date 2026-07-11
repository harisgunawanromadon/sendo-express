import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courierShipmentService } from "@/lib/api/services/delivery";
import { toast } from "react-hot-toast";
import type {
  CourierShipmentParams,
  PickUpShipmentRequest,
  DeliverToCustomerRequest,
} from "@/lib/api/types/delivery";

export const courierShipmentKeys = {
  all: ["courier-shipments"] as const,
  lists: () => [...courierShipmentKeys.all, "list"] as const,
  list: (filters?: CourierShipmentParams) =>
    [...courierShipmentKeys.lists(), filters] as const,
  details: () => [...courierShipmentKeys.all, "detail"] as const,
  detail: (trackingNumber: string) =>
    [...courierShipmentKeys.details(), trackingNumber] as const,
};

// get all courier shipments
export const useCourierShipments = (filters?: CourierShipmentParams) => {
  return useQuery({
    queryKey: courierShipmentKeys.list(filters),
    queryFn: () => courierShipmentService.getAllCourierShipments(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

// get one courier shipment
export const useCourierShipment = (trackingNumber: string, enabled = true) => {
  return useQuery({
    queryKey: courierShipmentKeys.detail(trackingNumber),
    queryFn: () => courierShipmentService.getOneCourierShipment(trackingNumber),
    enabled: !!trackingNumber && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePickShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackingNumber: string) =>
      courierShipmentService.pickShipment(trackingNumber),
    onSuccess: (_, trackingNumber) => {
      toast.success("Pengiriman berhasil diambil!");
      queryClient.invalidateQueries({ queryKey: courierShipmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: courierShipmentKeys.detail(trackingNumber),
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal mengambil pengiriman. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const usePickUpShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      trackingNumber,
      data,
    }: {
      trackingNumber: string;
      data: PickUpShipmentRequest;
    }) => courierShipmentService.pickUpShipment(trackingNumber, data),
    onSuccess: (_, { trackingNumber }) => {
      toast.success("Paket berhasil dijemput!");
      queryClient.invalidateQueries({ queryKey: courierShipmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: courierShipmentKeys.detail(trackingNumber),
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal mengonfirmasi penjemputan. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const useDeliverToBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackingNumber: string) =>
      courierShipmentService.deliverToBranch(trackingNumber),
    onSuccess: (_, trackingNumber) => {
      toast.success("Paket berhasil diantar ke cabang!");
      queryClient.invalidateQueries({ queryKey: courierShipmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: courierShipmentKeys.detail(trackingNumber),
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal mengantar paket ke cabang. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const usePickFromBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackingNumber: string) =>
      courierShipmentService.pickFromBranch(trackingNumber),
    onSuccess: (_, trackingNumber) => {
      toast.success("Pengiriman berhasil diambil dari cabang!");
      queryClient.invalidateQueries({ queryKey: courierShipmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: courierShipmentKeys.detail(trackingNumber),
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message ||
        "Gagal mengambil pengiriman dari cabang. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const usePickUpFromBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackingNumber: string) =>
      courierShipmentService.pickUpFromBranch(trackingNumber),
    onSuccess: (_, trackingNumber) => {
      toast.success("Paket berhasil diambil dari cabang!");
      queryClient.invalidateQueries({ queryKey: courierShipmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: courierShipmentKeys.detail(trackingNumber),
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message ||
        "Gagal mengonfirmasi pengambilan dari cabang. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const useDeliverToCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      trackingNumber,
      data,
    }: {
      trackingNumber: string;
      data: DeliverToCustomerRequest;
    }) => courierShipmentService.deliverToCustomer(trackingNumber, data),
    onSuccess: (_, { trackingNumber }) => {
      toast.success("Paket berhasil diterima penerima!");
      queryClient.invalidateQueries({ queryKey: courierShipmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: courierShipmentKeys.detail(trackingNumber),
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal mengonfirmasi penerimaan. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};
