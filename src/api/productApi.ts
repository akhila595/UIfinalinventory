import axios from "@/api/axios";

// ---------------- PRODUCTS ----------------

// Get all products
export const getAllProducts = async () => {
  const res = await axios.get("/api/products");
  return res.data; // Returns { message: "...", data: [...] }
};

// Get product by ID
export const getProductById = async (id: number) => {
  const res = await axios.get(`/api/products/${id}`);
  return res.data; // Returns { message: "...", data: { ... } }
};

// Get product by design code
export const getProductByDesignCode = async (designCode: string) => {
  const res = await axios.get(`/api/products/design/${designCode}`);
  return res.data; // Returns { message: "...", data: { ... } }
};

// Create new product
export const createProduct = async (data: any) => {
  const res = await axios.post("/api/products", data);
  return res.data; // Returns { message: "...", data: { ... } }
};

// Update existing product
export const updateProduct = async (id: number, data: any) => {
  const res = await axios.put(`/api/products/${id}`, data);
  return res.data; // Returns { message: "...", data: { ... } }
};

// Delete product by ID
export const deleteProduct = async (id: number) => {
  const res = await axios.delete(`/api/products/${id}`);
  return res.data; // Returns { message: "Product deleted successfully with ID: ..." }
};
