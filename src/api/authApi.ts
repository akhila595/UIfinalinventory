import api from "@/api/axios";

interface LoginPayload {
  email: string;
  password: string;
}

// ✅ Login API
export const loginUser = (payload: LoginPayload) => {
  return api.post("/api/auth/login", payload);
};

// ✅ Register API (optional)
export const registerUser = (payload: { name: string; email: string; password: string; role: "USER" | "ADMIN" }) => {
  return api.post("/api/auth/register", payload);
};


// ✅ Forgot password API (optional)
export const forgotPassword = (payload: { email: string }) => {
  return api.post("/api/auth/forgot-password", payload);
};
