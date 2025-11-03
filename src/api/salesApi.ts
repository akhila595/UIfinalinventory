import axios from "@/api/axios";

export const getSalesSummary = async () => (await axios.get("/api/reports/daily", { params: { date: new Date().toISOString().split("T")[0] } })).data;
export const getProfitLoss = async (startDate: string, endDate: string) =>
  (await axios.get(`/api/reports/category`, { params: { startDate, endDate } })).data;
