import { ReviewForm, Review } from "../../types/types";
import { apiClient } from "./ApiClient";

export const getAllReviewsApi = () => {
  return apiClient.get(`/reviews`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to get all reviews.");
    } else {
      throw error;
    }
  });
};

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

export const createReviewApi = (productId: number, review: ReviewForm) => {
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

export const deleteReviewApi = (product_id: number, review_id: number) => {
  return apiClient
    .delete(`/products/${product_id}/${review_id}`)
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
