import axios from "./axios";

export const getSuppliers = async () => {
  return (await axios.get("/api/suppliers")).data;
};

export const createSupplier = async (data: any) => {
  return (await axios.post("/api/suppliers", data)).data;
};

export const updateSupplier = async (id: number, data: any) => {
  return (await axios.put(`/api/suppliers/${id}`, data)).data;
};

export const deleteSupplier = async (id: number) => {
  return (await axios.delete(`/api/suppliers/${id}`)).data;
};
