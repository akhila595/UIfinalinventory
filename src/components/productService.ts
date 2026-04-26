import { getAllProducts } from "../api/api";

export const getTotalProducts = async () => {
  try {
    const res = await getAllProducts();

    return res.data.length; // only return count
  } catch (error) {
    console.error("Error fetching total products", error);
    return 0;
  }
};