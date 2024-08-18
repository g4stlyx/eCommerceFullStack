import { User, UserSignUp } from "../../types/types"
import { apiClient } from "./ApiClient"

export const getAllUsersApi = () => apiClient.get("/users")
export const getUserByUsernameApi = (username:string) => apiClient.get(`/users/${username}`)
export const deleteUserApi = (id:number) => apiClient.delete(`/users/${id}`)
export const updateUserApi = (username:string, user:User) => apiClient.put(`/users/${username}`, user)
export const createUserApi = (user:User) => apiClient.post("/users", user)
export const signupApi = (user:UserSignUp) => apiClient.post("/signup", user)
// export const updateTodoApi = (username:string, id:number, todo:Todo) => {
//     return apiClient.put(`users/${username}/todos/${id}`, todo)
//         .catch(error => {
//             if (error.response.status === 403) {
//                 throw new Error("You are not authorized to update this todo.");
//             } else {
//                 throw error;
//             }
//         });
// }