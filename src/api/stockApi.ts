import axios from "@/api/axios";

/* =====================================================
   STOCK IN
===================================================== */

export const stockIn = async (data: any) => {
  const response = await axios.post("/api/stock", data);
  return response.data;
};


/* =====================================================
   STOCK OUT
===================================================== */

export const stockOut = async (data: any) => {
  const response = await axios.post("/api/stock/out", data);
  return response.data;
};


/* =====================================================
   RECENT STOCK IN
===================================================== */

export const getRecentStockIns = async () => {
  const response = await axios.get("/api/stock/recent-ins");
  return response.data;
};


/* =====================================================
   RECENT STOCK OUT
===================================================== */

export const getRecentStockOuts = async () => {
  const response = await axios.get("/api/stock/recent-outs");
  return response.data;
};


/* =====================================================
   PRODUCTS
===================================================== */

export const getAllProducts = async () => {
  const res = await axios.get("/api/products");
  return res.data.data || [];
};


/* =====================================================
   PRODUCT ATTRIBUTES
===================================================== */

export const getProductAttributes = async (productId: number) => {
  const res = await axios.get(`/api/product-attributes/product/${productId}`);
  return res.data || [];
};


/* =====================================================
   ATTRIBUTE VALUES
===================================================== */

export const getAttributeValues = async (attributeId: number) => {
  const res = await axios.get(`/api/attribute-values/attribute/${attributeId}`);
  return res.data || [];
};


export const getVariantsByProduct = async (productId: number) => {
  const res = await axios.get(`/api/products/variants/${productId}`);
  return res.data || [];
};