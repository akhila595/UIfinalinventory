import axios from "@/api/axios";

/* =========================
   DAILY REPORT
========================= */

export const getDailyReport = async (date: string) => {
  const res = await axios.get("/api/reports/daily", { params: { date } });
  return res.data;
};


/* =========================
   MONTHLY REPORT
========================= */

export const getMonthlyReport = async (year: number, month: number) => {
  const res = await axios.get("/api/reports/monthly", {
    params: { year, month },
  });
  return res.data;
};


/* =========================
   WEEKLY REPORT
========================= */

export const getWeeklyReport = async (startDate: string, endDate: string) => {
  const res = await axios.get("/api/reports/weekly", {
    params: { startDate, endDate },
  });
  return res.data;
};


/* =========================
   YEARLY REPORT
========================= */

export const getYearlyReport = async (year: number) => {
  const res = await axios.get("/api/reports/yearly", {
    params: { year },
  });
  return res.data;
};


/* =========================
   CATEGORY REPORT
========================= */

export const getCategoryReport = async (startDate: string, endDate: string) => {
  const res = await axios.get("/api/reports/category", {
    params: { startDate, endDate },
  });
  return res.data;
};


/* =========================
   TOP SELLING PRODUCTS
========================= */

export const getTopSellingProducts = async (
  startDate: string,
  endDate: string,
  limit = 5
) => {
  const res = await axios.get("/api/reports/top-selling", {
    params: { startDate, endDate, limit },
  });
  return res.data;
};


/* =========================
   LOW STOCK PRODUCTS
========================= */

export const getLowStockProducts = async (threshold = 10) => {
  const res = await axios.get("/api/reports/low-stock", {
    params: { threshold },
  });
  return res.data;
};


/* =========================
   PURCHASE REPORT
========================= */

export const getPurchaseReport = async (startDate: string, endDate: string) => {
  const res = await axios.get("/api/reports/purchases", {
    params: { startDate, endDate },
  });
  return res.data;
};



export const getAttributesReport = async () =>
  (await axios.get("/api/master/attributes-with-values")).data;