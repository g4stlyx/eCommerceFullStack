import { apiClient } from "./ApiClient";

export const getWishlistApi = () => {
  return apiClient.get(`/wishlist`).catch((error) => {
    throw error;
  });
};

export const addItemToWishlistApi = (productId: number) => {
  return apiClient.post(`/wishlist/${productId}`).catch((error) => {
    throw error;
  });
};

export const removeItemFromWishlistApi = (wishlistItemId: number) => {
  return apiClient.delete(`/wishlist/${wishlistItemId}`).catch((error) => {
    throw error;
  });
};
