import axios from "@/api/axios";

/**
 * Add new stock-in record with image upload (multipart form data)
 */
export const stockIn = async (formData: FormData) => {
  const response = await axios.post("/api/stock-in", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Record stock-out (JSON request)
 */
export const stockOut = async (data: any) => {
  const response = await axios.post("/api/stock-out", data);
  return response.data;
};

/**
 * Fetch recent stock-in history
 */
export const getRecentStockIns = async () => {
  const response = await axios.get("/api/recent-stock-ins");
  return response.data;
};

export const getRecentStockOuts = async () => {
  const response = await axios.get("/api/recent-stock-outs");
  return response.data;
};