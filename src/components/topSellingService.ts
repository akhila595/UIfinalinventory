import { getTopSellingProducts } from "../api/api";

export const getTopSellingList = async () => {
  try {
    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    const startDate = new Date();
    startDate.setDate(today.getDate() - 7); // last 7 days

    const start = startDate.toISOString().split("T")[0];

    const res = await getTopSellingProducts(start, endDate);

    return res;
  } catch (error) {
    console.error("Top selling error", error);
    return [];
  }
};