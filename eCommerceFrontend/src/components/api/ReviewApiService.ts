import { Review } from "../../types/types";
import { apiClient } from "./ApiClient";

export const getReviewsByProductIdApi = (productId: number) => {
  return apiClient.get(`/products/${productId}/reviews`).catch((error) => {
    throw error;
  });
};

export const getReviewApi = (productId: number, reviewId: number) => {
  return apiClient
    .get(`/products/${productId}/reviews/${reviewId}`)
    .catch((error) => {
      if (error.response.status === 400) {
        throw new Error("Error matching the review with the product");
      } else {
        throw error;
      }
    });
};

export const createReviewApi = (productId: number, review: Review) => {
  return apiClient
    .post(`/products/${productId}/reviews`, review)
    .catch((error) => {
      throw error;
    });
};

export const updateReviewApi = (
  productId: number,
  reviewId: number,
  review: Review
) => {
  return apiClient
    .put(`/products/${productId}/${reviewId}`, review)
    .catch((error) => {
      if (error.response.status === 403) {
        throw new Error("You are not authorized to update this review.");
      } else if (error.response.status === 404) {
        throw new Error("User or/and Review not found!");
      } else {
        throw error;
      }
    });
};

export const deleteReviewApi = (productId: number, reviewId: number) => {
  return apiClient
    .delete(`/products/${productId}/${reviewId}`)
    .catch((error) => {
      if (error.response.status === 403) {
        throw new Error("You are not authorized to delete this review.");
      } else if (error.response.status === 404) {
        throw new Error("User or/and Review not found!");
      } else if (error.response.status === 400) {
        throw new Error("Error matching the review with the product");
      }  
      else {
        throw error;
      }
    });
};
