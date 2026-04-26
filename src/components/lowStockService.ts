import { getLowStockProducts } from "../api/api";

export const getLowStockCount = async () => {
  try {
    const res = await getLowStockProducts();
    return res.length;
  } catch (error) {
    console.error("Low stock error", error);
    return 0;
  }
};

export const getLowStockList = async () => {
  try {
    const res = await getLowStockProducts();
    return res; // full list
  } catch (error) {
    console.error("Low stock list error", error);
    return [];
  }
};