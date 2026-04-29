import { getMonthlyReport } from "../api/api";

export const getMonthlyProfit = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const res = await getMonthlyReport(year, month);

    const profit = res?.totalProfit ?? 0;
    const loss = res?.totalLoss ?? 0;

    return profit - loss;
  } catch (error) {
    console.error("Monthly profit error", error);
    return 0;
  }
};