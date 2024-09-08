import { UserForm } from "../../types/types"
import { apiClient } from "./ApiClient"

export const getAllUsersApi = () => apiClient.get("/users")
export const getUserByUsernameApi = (username:string) => apiClient.get(`/users/${username}`)
export const deleteUserApi = (id:number) => apiClient.delete(`/users/${id}`)
export const updateUserApi = (username:string, user:UserForm) => apiClient.put(`/users/${username}`, user)
export const createUserApi = (user:UserForm) => apiClient.post("/users", user)
export const signupApi = (user:UserForm) => apiClient.post("/signup", user)