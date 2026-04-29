import { getTopSellingProducts } from "../api/api";

export const getTopSellingList = async () => {
  try {
    const today = new Date();

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const endDate = today;

    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    const res = await getTopSellingProducts(start, end, 5);

    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.error("Top selling error", error);
    return [];
  }
};