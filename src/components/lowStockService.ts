import { getLowStockProducts } from "../api/api";

export const getLowStockCount = async () => {
  try {
    const res = await getLowStockProducts();

    return Array.isArray(res) ? res.length : 0;
  } catch (error) {
    console.error("Low stock count error", error);
    return 0;
  }
};

export const getLowStockList = async () => {
  try {
    const res = await getLowStockProducts();

    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.error("Low stock list error", error);
    return [];
  }
};