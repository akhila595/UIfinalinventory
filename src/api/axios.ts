// src/api/axios.ts
import axios from "axios";

// ✅ Create Axios instance
const api = axios.create({
  // ❗ URL must come ONLY from env (no localhost fallback in code)
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    // ✅ Ensure headers always exist (TypeScript safe)
    config.headers = config.headers ?? {};

    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    const selectedCustomerId = localStorage.getItem("selectedCustomerId");

    // 🔹 Authorization header
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // 🔹 SuperAdmin + Customer context
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

      (config.headers as any)["X-Is-SuperAdmin"] = isSuperAdmin ? "true" : "false";

      // ✅ Attach customerId ONLY for SuperAdmin
      if (isSuperAdmin && selectedCustomerId) {
        (config.headers as any)["X-Customer-Id"] = selectedCustomerId;
      }
    } catch {
      (config.headers as any)["X-Is-SuperAdmin"] = "false";
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
     * ❗ Do NOT redirect on login failure
     * Redirect only if token is invalid/expired
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
