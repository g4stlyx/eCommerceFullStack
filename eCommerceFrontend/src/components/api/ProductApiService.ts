import { Product } from "../../types/types";
import { apiClient } from "./ApiClient";

export const getAllProductsApi = () => apiClient.get("/products");

export const getProductByIdApi = (productId: number) => {
  return apiClient.get(`/products/${productId}`).catch((error) => {
    if (error.response.status === 404) {
      throw new Error("Product not found!");
    } else {
      throw error;
    }
  });
};

export const createProductApi = (product: Product) => {
  return apiClient.post("/products", product).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to create a product.");
    } else {
      throw error;
    }
  });
};

export const updateProductApi = (productId: number, product: Product) => {
  return apiClient.put(`/products/${productId}`, product).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to update this product.");
    } else {
      throw error;
    }
  });
};

export const deleteProductApi = (productId: number) => {
  apiClient.delete(`/products/${productId}`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to delete this product.");
    } else {
      throw error;
    }
  });
};

export const searchAndFilterProductsApi = (queryParams: {
  q?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
}) => {
  const params = new URLSearchParams();

  if (queryParams.q) params.append("q", queryParams.q);
  if (queryParams.category) params.append("category", queryParams.category);
  if (queryParams.price_min !== undefined)
    params.append("price_min", queryParams.price_min.toString());
  if (queryParams.price_max !== undefined)
    params.append("price_max", queryParams.price_max.toString());

  return apiClient
    .get(`/products/search?${params.toString()}`)
    .catch((error) => {
      throw error;
    });
};
