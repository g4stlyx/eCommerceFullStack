import { Order } from "../../types/types";
import { apiClient } from "./ApiClient";

export const getAllOrdersApi = () => {
  return apiClient.get(`/orders`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to update this review.");
    } else {
      throw error;
    }
  });
};

export const getOrderByIdApi = (orderId: number) => {
  return apiClient.get(`/orders/${orderId}`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to update this review.");
    } else {
      throw error;
    }
  });
};

export const createOrderApi = (order:Order) => {
  return apiClient
    .post(`/orders`, order)
    .catch((error) => {
      throw error;
    });
};

export const cancelOrderApi = (
  orderId: number,
) => {
  return apiClient
    .put(`/orders/${orderId}/cancel`)
    .catch((error) => {
      if (error.response.status === 403) {
        throw new Error("You are not authorized to update this review.");
      } else if (error.response.status === 400) {
        throw new Error("You cannot cancel an order which is SHIPPED or DELIVERED!");
      } else {
        throw error;
      }
    });
};
