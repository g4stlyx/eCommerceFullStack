import { Category } from "../../types/types";
import { apiClient } from "./ApiClient";

export const getAllCategoriesApi = () => apiClient.get("/categories");

export const getCategoryByIdApi = (categoryId: number) => {
  return apiClient.get(`/categories/${categoryId}`).catch((error) => {
    if (error.response.status === 404) {
      throw new Error("Category not found!");
    } else {
      throw error;
    }
  });
};

export const createCategoryApi = (category: Category) => {
  return apiClient.post("/categories/", category).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to create a category.");
    } else {
      throw error;
    }
  });
};

export const updateCategoryApi = (categoryId: number, category: Category) => {
  return apiClient.put(`/categories/${categoryId}`, category).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to update a category.");
    } else {
      throw error;
    }
  });
};

export const deleteCategoryApi = (categoryId: number) => {
  return apiClient.delete(`/categories/${categoryId}`).catch((error) => {
    if (error.response.status === 403) {
      throw new Error("You are not authorized to delete a category.");
    } else {
      throw error;
    }
  });
};
