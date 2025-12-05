import api from "@/api/axios";

interface LoginPayload {
  email: string;
  password: string;
}

// ✅ Login API
export const loginUser = (payload: LoginPayload) => {
  return api.post("/api/auth/login", payload);
};

// ✅ Register API (no roles here)
export const registerUser = (payload: { name: string; email: string; password: string }) => {
  return api.post("/api/auth/register", payload);
};

// ✅ Forgot password API
export const forgotPassword = (payload: { email: string }) => {
  return api.post("/api/auth/forgot-password", payload);
};

// ✅ NEW — Fetch logged-in user details (roles included)
export const getCurrentUser = () => {
  return api.get("/api/users/me");
};
