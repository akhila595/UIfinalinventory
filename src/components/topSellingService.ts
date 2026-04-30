import { getTopSellingProducts } from "../api/api";

export const getTopSellingList = async () => {
  try {
    const today = new Date();

    // ✅ First day of month
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // ✅ Last day of month
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const res = await getTopSellingProducts(start, end, 10); // ✅ limit changed

    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.error("Top selling error", error);
    return [];
  }
};