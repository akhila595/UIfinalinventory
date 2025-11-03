import React, { useEffect, useState } from "react";
import { getDailyReport } from "@/api/reportApi";

interface ProductSale {
  productName: string;
  sku: string;
  quantity: number;
  saleTotal: number;
  costTotal: number;
  profit: number;
  loss: number;
}

interface DailyReportData {
  date: string;
  totalSales: number;
  totalProfit: number;
  totalLoss: number;
  totalQuantitySold: number;
  productSales: ProductSale[];
}

const DailyReport: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDailyReport(selectedDate)
      .then((res) => setReportData(res.data))
      .catch((err) => console.error("Error fetching daily report:", err))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  if (loading) return <div>Loading...</div>;
  if (!reportData) return <div>No data available.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10">
      <div className="mb-4">
        <label className="font-medium mr-2">📅 Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1"
          max={today}
        />
      </div>

      <h2 className="text-xl font-bold mb-4">
        🗓 Daily Sales Report ({reportData.date})
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">
          Total Sales: ₹{reportData.totalSales.toFixed(2)}
        </div>
        <div className="bg-green-100 p-4 rounded">
          Total Profit: ₹{reportData.totalProfit.toFixed(2)}
        </div>
        <div className="bg-red-100 p-4 rounded">
          Total Loss: ₹{reportData.totalLoss.toFixed(2)}
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          Qty Sold: {reportData.totalQuantitySold}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">SKU</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Sale Total</th>
              <th className="border px-4 py-2">Cost Total</th>
              <th className="border px-4 py-2">Profit</th>
              <th className="border px-4 py-2">Loss</th>
            </tr>
          </thead>
          <tbody>
            {reportData.productSales.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.productName}</td>
                <td className="border px-4 py-2">{item.sku}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">₹{item.saleTotal.toFixed(2)}</td>
                <td className="border px-4 py-2">₹{item.costTotal.toFixed(2)}</td>
                <td className="border px-4 py-2 text-green-700">₹{item.profit.toFixed(2)}</td>
                <td className="border px-4 py-2 text-red-700">₹{item.loss.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyReport;
