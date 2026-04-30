import api from "./axios";

/* ================= AUTH ================= */

export const loginUser = (payload: any) => {
  return api.post("/auth/login", payload);
};

export const forgotPassword = (payload: any) => {
  return api.post("/auth/forgot-password", payload);
};

export const getCurrentUser = () => {
  return api.get("/users/me");
};

/* ================= REPORTS ================= */

export const getTopSellingProducts = async (
  startDate: string,
  endDate: string,
  limit = 10
) => {
  const res = await api.get("/reports/top-selling", { // ✅ FIXED
    params: { startDate, endDate, limit },
  });
  return res.data;
};

export const getLowStockProducts = async () => {
  const res = await api.get("/reports/low-stock?threshold=100"); // ✅ FIXED
  return res.data;
};

export const getDailyReport = async (date: string) => {
  const res = await api.get(`/reports/daily?date=${date}`); // ✅ FIXED
  return res.data;
};

export const getMonthlyReport = async (year: number, month: number) => {
  const res = await api.get("/reports/monthly", { // already correct ✅
    params: { year, month },
  });
  return res.data;
};

 // ---------------- PRODUCTS ----------------

 // Get all products
export const getAllProducts = async () => {
  const res = await api.get("/products"); // ✅ FIXED
  return res.data.data;
};

// Create product
export const createProduct = async (data: any) => {
  const res = await api.post("/products", data);
  return res.data;
};

// ---------------- MASTER DATA ----------------

// Brands
export const getBrands = async () => {
  const res = await api.get("/master/brands");
  return res.data;
};

// Categories
export const getCategories = async () => {
  const res = await api.get("/master/categories");
  return res.data;
};

// Attributes
export const getAttributes = async () => {
  const res = await api.get("/master/attributes");
  return res.data;
};

// ---------------- IMAGE UPLOAD ----------------

export const uploadProductImage = async (formData: any) => {
  const res = await api.post(
    "/api/products/uploads/temp-image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};