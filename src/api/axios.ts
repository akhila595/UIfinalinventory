// src/api/axios.ts
import axios from "axios";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    const selectedCustomerId = localStorage.getItem("selectedCustomerId");

    // 🔹 Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔹 SuperAdmin flag
    try {
      const user = userData ? JSON.parse(userData) : {};
      const roles = user?.roles || user?.roleNames || [];
      const isSuperAdmin =
        Array.isArray(roles) &&
        roles.some(
          (r: string) =>
            r.toUpperCase() === "SUPERADMIN" ||
            r.toUpperCase() === "SUPER_ADMIN"
        );

      config.headers["X-Is-SuperAdmin"] = isSuperAdmin ? "true" : "false";

      // ✅ Attach customerId ONLY for SuperAdmin
      if (isSuperAdmin && selectedCustomerId) {
        config.headers["X-Customer-Id"] = selectedCustomerId;
      }
    } catch {
      config.headers["X-Is-SuperAdmin"] = "false";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    /**
     * 🔴 IMPORTANT FIX
     * Do NOT auto-redirect on login failure
     */
    if (status === 401 && !requestUrl.includes("/api/auth/login")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("selectedCustomerId");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
//