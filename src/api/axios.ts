import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://10.0.2.2:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    const userData = await AsyncStorage.getItem("userData");
    const selectedCustomerId = await AsyncStorage.getItem("selectedCustomerId");

    const headers = config.headers as any;

    // ✅ Authorization (MANDATORY)
    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    try {
      const user = userData ? JSON.parse(userData) : {};
      const roles = user?.roles || [];

      const isSuperAdmin =
        Array.isArray(roles) &&
        roles.some(
          (r: string) =>
            r.toUpperCase() === "SUPERADMIN" ||
            r.toUpperCase() === "SUPER_ADMIN"
        );

      // ✅ MUST SEND THIS ALWAYS
      headers["X-Is-SuperAdmin"] = isSuperAdmin ? "true" : "false";

      // ✅ ONLY FOR SUPER ADMIN
      if (isSuperAdmin && selectedCustomerId) {
        headers["X-Customer-Id"] = selectedCustomerId;
      }

    } catch {
      headers["X-Is-SuperAdmin"] = "false";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;