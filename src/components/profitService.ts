import { getDailyReport } from "../api/api";

export const getTodayProfit = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const res = await getDailyReport(today);

    const profit = res.totalProfit || 0;
    const loss = res.totalLoss || 0;

    return profit - loss;
  } catch (error) {
    console.error("Profit error", error);
    return 0;
  }
};