import api from "./axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

// ✅ Login API
export const loginUser = (payload: LoginPayload) => {
  return api.post("/auth/login", payload);
};

// ✅ Forgot Password API
export const forgotPassword = (payload: ForgotPasswordPayload) => {
  return api.post("/auth/forgot-password", payload);
};

// ✅ Get logged in user details
export const getCurrentUser = () => {
  return api.get("/users/me");
};
// ---------------- PRODUCTS ----------------

// Get all products
export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data; // { message, data: [...] }
};

// ---------------- REPORTS / DASHBOARD ----------------

// Get top selling products
export const getTopSellingProducts = async (
  startDate: string,
  endDate: string
) => {
  const res = await api.get(
    `/reports/top-selling?startDate=${startDate}&endDate=${endDate}&limit=5`
  );
  return res.data; // array
};

// Get low stock products
export const getLowStockProducts = async () => {
  const res = await api.get("/reports/low-stock?threshold=10");
  return res.data; // array
};

// Get daily profit/loss report
export const getDailyReport = async (date: string) => {
  const res = await api.get(`/reports/daily?date=${date}`);
  return res.data; // object
};