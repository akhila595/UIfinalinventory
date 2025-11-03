import axios from "@/api/axios";

export const getCategories = async () => (await axios.get("/api/categories")).data;
export const createCategory = async (data: any) => (await axios.post("/api/categories/create", data)).data;

export const getBrands = async () => (await axios.get("/api/brands")).data;
export const createBrand = async (data: any) => (await axios.post("/api/brands/create", data)).data;

export const getClothTypes = async () => (await axios.get("/api/cloth-types")).data;
export const createClothType = async (data: any) => (await axios.post("/api/cloth-types/create", data)).data;

export const getColors = async () => (await axios.get("/api/colors")).data;
export const createColor = async (data: any) => (await axios.post("/api/colors/create", data)).data;

export const getSizes = async () => (await axios.get("/api/sizes")).data;
export const createSize = async (data: any) => (await axios.post("/api/sizes/create", data)).data;
