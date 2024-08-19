import { apiClient } from "./ApiClient";

export const getCartApi = () => apiClient.get("/cart");

export const getCartByIdApi = (cartId: number) => {
  return apiClient.get(`/cart/${cartId}`).catch((error) => {
    if (error.response.status === 404) {
      throw new Error("Cart not found!");
    } else {
      throw error;
    }
  });
};

export const addItemToCartApi = (productId: number) => {
  return apiClient.post(`/cart/${productId}`).catch((error) => {
    throw error;
  });
};

export const removeItemFromCartApi = (cartItemId: number) => {
  return apiClient.delete(`/cart/${cartItemId}`).catch((error) => {
    throw error;
  });
};

export const updateItemQuantityApi = (cartItemId: number) => {
  return apiClient.put(`/cart/${cartItemId}/quantity`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to update a category.");
    } else {
      throw error;
    }
  });
};

export const createOrderFromCartApi = (cartId: number) => {
  return apiClient.post(`/cart/${cartId}/order`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to update a category.");
    } else {
      throw error;
    }
  });
};
