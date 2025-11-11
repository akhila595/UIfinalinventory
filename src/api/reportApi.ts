import axios from "@/api/axios";

export const getDailyReport = async (date: string) =>
  (await axios.get(`/api/reports/daily`, { params: { date } })).data;

export const getMonthlyReport = async (year: number, month: number) =>
  (await axios.get(`/api/reports/monthly`, { params: { year, month } })).data;

export const getCategoryReport = async (startDate: string, endDate: string) =>
  (await axios.get(`/api/reports/category`, { params: { startDate, endDate } })).data;

export const getSupplierReport = async (supplierId: number, startDate: string, endDate: string) =>
  (await axios.get(`/api/reports/supplier/${supplierId}`, { params: { startDate, endDate } })).data;

export const getAllSuppliersPurchaseReport = async (startDate: string, endDate: string) =>
  (await axios.get(`/api/reports/suppliers`, { params: { startDate, endDate } })).data;

export const getTopSellingProducts = async (startDate: string, endDate: string, limit = 5) =>
  (await axios.get(`/api/reports/top-selling`, { params: { startDate, endDate, limit } })).data;

export const getLowStockProducts = async () =>
  (await axios.get(`/api/reports/low-stock`)).data;

export const getWeeklyReport = async (startDate: string, endDate: string) =>
  (await axios.get(`/api/reports/weekly`, { params: { startDate, endDate } })).data;

export const getYearlyReport = async (year: number) =>
  (await axios.get(`/api/reports/yearly`, { params: { year } })).data;

export const getSupplierPurchaseHistory = async (
  supplierId: number,
  startDate: string,
  endDate: string
) =>
  (
    await axios.get(`/api/reports/supplier/${supplierId}`, {
      params: { startDate, endDate },
    })
  ).data;
