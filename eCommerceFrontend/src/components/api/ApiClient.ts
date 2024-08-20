import axios from "axios"

export const apiClient = axios.create(
    {
        baseURL: 'http://localhost:8080',
        headers:{
            'Content-Type': 'application/json'
            ,'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Credentials': 'true'
        }
    }
)