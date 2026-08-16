import axios from "axios";
import { store } from "../store/store";
import { refresh  } from "../store/slices/authSlice.js";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;

    },
    (error) => Promise.reject(error)
);

let refreshPromise = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = store.dispatch(refresh()).unwrap().finally(() => refreshPromise = false);

            }

            const newAcessToken = await refreshPromise;

            originalRequest.config.headers = `Bearer ${newAcessToken}`;

            return api(originalRequest);

        } catch (error) {
  
            return Promise.reject(error)

        }
    }
)


export default api;