// src/api/axios.ts
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add request interceptor to include JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add response interceptor to handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Handle expired token or unauthorized access
      if (status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login"; // redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
