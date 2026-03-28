import axios from "@/api/axios";

/* ======================================
   CATEGORIES
====================================== */

export const getCategories = async () =>
  (await axios.get("/api/master/categories")).data;

export const createCategory = async (data: any) =>
  (await axios.post("/api/master/categories", data)).data;

export const deleteCategory = async (id: number) =>
  (await axios.delete(`/api/master/categories/${id}`)).data;


/* ======================================
   BRANDS
====================================== */

export const getBrands = async () =>
  (await axios.get("/api/master/brands")).data;

export const createBrand = async (data: any) =>
  (await axios.post("/api/master/brands", data)).data;

export const deleteBrand = async (id: number) =>
  (await axios.delete(`/api/master/brands/${id}`)).data;


/* ======================================
   ATTRIBUTES
====================================== */

export const getAttributes = async () =>
  (await axios.get("/api/master/attributes")).data;

export const createAttribute = async (data: any) =>
  (await axios.post("/api/master/attributes", data)).data;

export const deleteAttribute = async (id: number) =>
  (await axios.delete(`/api/master/attributes/${id}`)).data;


/* ======================================
   ATTRIBUTE VALUES
====================================== */

export const getAttributeValues = async (attributeId: number) =>
  (await axios.get(`/api/master/attribute-values/${attributeId}`)).data;

export const createAttributeValue = async (data: any) =>
  (await axios.post("/api/master/attribute-values", data)).data;

export const deleteAttributeValue = async (id: number) =>
  (await axios.delete(`/api/master/attribute-values/${id}`)).data;


/* ======================================
   SUPPLIERS
====================================== */

export const getSuppliers = async () =>
  (await axios.get("/api/suppliers")).data;

/*========================================
attributeteswithvalues
========================================*/

export const getAttributesWithValues = async () => {
  const res = await axios.get("/api/master/attributes-with-values");
  return res.data || [];
};