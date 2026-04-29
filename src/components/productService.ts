import { getAllProducts } from "../api/api";

export const getTotalProducts = async () => {
  try {
    const res = await getAllProducts();

    // ✅ res is already array
    return Array.isArray(res) ? res.length : 0;
  } catch (error) {
    console.error("Error fetching total products", error);
    return 0;
  }
};