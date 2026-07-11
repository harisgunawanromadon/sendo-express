import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
  CourierShipment,
  CourierShipmentActionResult,
  CourierShipmentParams,
  GetAllCourierShipmentsResponse,
  GetOneCourierShipmentResponse,
  CourierShipmentActionResponse,
  PickUpShipmentRequest,
  DeliverToCustomerRequest,
  DeliverToCustomerResponse,
} from "@/lib/api/types/delivery";

// Find All Shipments Courier
export const courierShipmentService = {
  async getAllCourierShipments(
    params?: CourierShipmentParams,
  ): Promise<GetAllCourierShipmentsResponse> {
    try {
      const response = await apiClient.get<GetAllCourierShipmentsResponse>(
        "/api/shipments/courier",
        { params },
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Find One Shipment Courier
  async getOneCourierShipment(
    trackingNumber: string,
  ): Promise<CourierShipment> {
    try {
      const response = await apiClient.get<GetOneCourierShipmentResponse>(
        `/api/shipments/courier/${trackingNumber}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Pick Shipment
  async pickShipment(
    trackingNumber: string,
  ): Promise<CourierShipmentActionResult> {
    try {
      const response = await apiClient.patch<CourierShipmentActionResponse>(
        `/api/shipments/courier/pick/${trackingNumber}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Pick Up Shipment
  async pickUpShipment(
    trackingNumber: string,
    data: PickUpShipmentRequest,
  ): Promise<CourierShipmentActionResult> {
    try {
      const response = await apiClient.patch<CourierShipmentActionResponse>(
        `/api/shipments/courier/${trackingNumber}/pick-up`,
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Deliver To Branch
  async deliverToBranch(
    trackingNumber: string,
  ): Promise<CourierShipmentActionResult> {
    try {
      const response = await apiClient.patch<CourierShipmentActionResponse>(
        `/api/shipments/courier/deliver-branches/${trackingNumber}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Pick From Branch
  async pickFromBranch(
    trackingNumber: string,
  ): Promise<CourierShipmentActionResult> {
    try {
      const response = await apiClient.patch<CourierShipmentActionResponse>(
        `/api/shipments/courier/pick-from-branches/${trackingNumber}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Pick Up From Branch
  async pickUpFromBranch(
    trackingNumber: string,
  ): Promise<CourierShipmentActionResult> {
    try {
      const response = await apiClient.patch<CourierShipmentActionResponse>(
        `/api/shipments/courier/pickup-from-branch/${trackingNumber}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Deliver To Customer
  async deliverToCustomer(
    trackingNumber: string,
    data: DeliverToCustomerRequest,
  ): Promise<DeliverToCustomerResponse> {
    try {
      const response = await apiClient.patch<DeliverToCustomerResponse>(
        `/api/shipments/courier/deliver-to-customer/${trackingNumber}`,
        data,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
