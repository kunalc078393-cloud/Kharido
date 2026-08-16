import api from "./api.js";

export const loginUser = async (userData) => {
    const response = await api.post("/auth/login",userData);
    return response.data;
}

export const registerUser = async (userDate) => {
    const response = await api.post("/auth/register",userDate);
    return response.data;
}

export const logoutUser = async () => {
    const response = await api.get("/auth/logout");
    return response.data;
} 

export const refreshAccessToken = async () => {
    const response = await api.get("/auth/refresh-token");
    return response.data;
}

export const getUser = async () => {
    const response = await api.get("/auth/getMe");
    return response.data;
}

