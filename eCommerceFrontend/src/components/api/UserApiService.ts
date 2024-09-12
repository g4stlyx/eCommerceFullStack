import { UserForm } from "../../types/types";
import { apiClient } from "./ApiClient";

export const getAllUsersApi = () => apiClient.get("/users");
export const getUserByUsernameApi = (username: string) =>
  apiClient.get(`/users/${username}`);
export const deleteUserApi = (id: number) => apiClient.delete(`/users/${id}`);
export const updateUserApi = (username: string, user: UserForm) =>
  apiClient.put(`/users/${username}`, user);
export const createUserApi = (user: UserForm) => apiClient.post("/users", user);
export const signupApi = (user: UserForm) => apiClient.post("/signup", user);

export const getOrdersByUsername = (username: string) =>
  apiClient.get(`/users/${username}/orders`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to see this order.");
    } else {
      throw error;
    }
  });

export const getReviewsByUsername = (username: string) =>
  apiClient.get(`/users/${username}/reviews`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to see these reviews.");
    } else {
      throw error;
    }
  });

export const getWishlistByUsername = (username: string) =>
  apiClient.get(`/users/${username}/wishlist`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to see this order.");
    } else {
      throw error;
    }
  });

export const getCartByUsername = (username: string) =>
  apiClient.get(`/users/${username}/cart`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to see this order.");
    } else {
      throw error;
    }
  });
