import React, { useEffect, useState } from "react";
import {
  getMonthlyReport,
  getLowStockProducts,
  getAllSuppliersPurchaseReport,
} from "@/api/reportApi";

import SalesWidget from "@/components/widgets/SalesWidget";
import ProfitLossWidget from "@/components/widgets/ProfitLossWidget";
import LowStockWidget from "@/components/widgets/LowStockWidget";
import TopSellingProductsWidget from "@/components/widgets/TopSellingProductsWidget";

const Dashboard: React.FC = () => {
  const [monthlyReport, setMonthlyReport] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [suppliersReport, setSuppliersReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const startDate = new Date(year, month - 1, 1)
          .toISOString()
          .split("T")[0];
        const endDate = new Date().toISOString().split("T")[0]; // Today

        const [monthly, low, suppliers] = await Promise.all([
          getMonthlyReport(year, month),
          getLowStockProducts(),
          getAllSuppliersPurchaseReport(startDate, endDate),
        ]);

        setMonthlyReport(monthly);
        setLowStock(low);
        setSuppliersReport(suppliers);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-700">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-semibold">
        {error}
      </div>
    );

  // Compute Low Stock count (e.g., stockQty <= 5)
  const lowStockCount = lowStock.filter(p => p.stockQty <= 5).length;

  // Compute Active Suppliers count (unique supplier names)
  const activeSuppliersCount = Array.from(
    new Set(suppliersReport.map(s => s.supplierName))
  ).length;

  return (
    <main className="flex-1 p-8 space-y-8 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">
          Welcome back! Here’s your business summary.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Sales"
          value={`₹${monthlyReport?.totalSales ?? 0}`}
          trend={monthlyReport?.salesGrowth}
          trendPositive={monthlyReport?.salesGrowth >= 0}
          titleColor="text-orange-500"
        />
        <SummaryCard
          title="Total Profit"
          value={`₹${monthlyReport?.totalProfit ?? 0}`}
          trend={monthlyReport?.profitGrowth}
          trendPositive={monthlyReport?.profitGrowth >= 0}
          titleColor="text-pink-500"
        />
        <SummaryCard
          title="Low Stock Items"
          value={lowStockCount}
          trendText="Refill Soon"
          color="orange"
          titleColor="text-yellow-500"
        />
        <SummaryCard
          title="Active Suppliers"
          value={activeSuppliersCount}
          color="purple"
          titleColor="text-green-500"
        />
      </div>

      {/* Graph Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%,30%] gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <SalesWidget data={monthlyReport?.productSales || []} />
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <ProfitLossWidget
            data={monthlyReport?.productSales || []}
            year={monthlyReport?.year || new Date().getFullYear()}
            month={monthlyReport?.month || new Date().getMonth() + 1}
          />
        </div>
      </div>

      {/* Product Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <LowStockWidget products={lowStock} />
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <TopSellingProductsWidget />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendText?: string;
  trendPositive?: boolean;
  color?: string;
  titleColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  trend,
  trendText,
  trendPositive,
  color = "blue",
  titleColor = "text-gray-600",
}) => {
  const borderColorMap: Record<string, string> = {
    blue: "border-blue-500",
    orange: "border-orange-500",
    purple: "border-purple-500",
    green: "border-green-500",
    red: "border-red-500",
  };

  const borderColor = borderColorMap[color] || "border-blue-500";

  const trendColor =
    trendPositive == null
      ? "text-gray-500"
      : trendPositive
      ? "text-green-600"
      : "text-red-600";

  return (
    <div
      className={`bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md hover:scale-[1.02] transition-transform border-t-4 ${borderColor}`}
    >
      <h3 className={`text-sm font-medium ${titleColor}`}>{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      {trend !== undefined ? (
        <p className={`${trendColor} text-sm mt-1`}>
          {trendPositive ? "▲" : "▼"} {trend}%
        </p>
      ) : (
        trendText && <p className="text-gray-500 text-sm mt-1">{trendText}</p>
      )}
    </div>
  );
};
