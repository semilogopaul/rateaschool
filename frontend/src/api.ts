import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
import refreshAccessToken from "./refreshAccessToken";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // Return successful responses as is
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && // Unauthorized error
      !originalRequest._retry // Avoid infinite loops
    ) {
      originalRequest._retry = true; // Mark this request for retry

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the failed request
      } else {
        console.error(
          "Refresh token expired or invalid. Redirecting to login."
        );
        // Redirect to login page or logout user
      }
    }

    return Promise.reject(error); // Reject other errors as is
  }
);

export default api;
