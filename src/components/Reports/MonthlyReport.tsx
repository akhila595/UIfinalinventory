import React, { useEffect, useState } from "react";
import { getMonthlyReport } from "@/api/reportApi"; // Import the API function

interface ProductSale {
  productName: string;
  sku: string;
  quantity: number;
  saleTotal: number;
  costTotal: number;
  profit: number;
  loss: number;
}

interface MonthlyReportData {
  productSales: ProductSale[];
  totalSales: number;
  totalProfit: number;
  totalLoss: number;
  totalQuantitySold: number;
}

export default function MonthlyReport() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-based
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [data, setData] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = (year: number, month: number) => {
    setLoading(true);
    getMonthlyReport(year, month) // Use the imported API function
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching monthly report:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedYear, selectedMonth);
  }, [selectedMonth, selectedYear]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) return <p>Loading Monthly Report...</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <label>
          📅 Select Month:{" "}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {monthNames.map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          🗓 Year:{" "}
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
            min={2000}
            max={2100}
          />
        </label>
      </div>

      <h2 className="text-xl font-bold mb-4">
        📆 Monthly Report ({monthNames[selectedMonth - 1]} {selectedYear})
      </h2>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">SKU</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Sales Total</th>
            <th className="border px-2 py-1">Cost Total</th>
            <th className="border px-2 py-1">Profit</th>
            <th className="border px-2 py-1">Loss</th>
          </tr>
        </thead>
        <tbody>
          {data.productSales.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-2 py-1">{item.productName}</td>
              <td className="border px-2 py-1">{item.sku}</td>
              <td className="border px-2 py-1">{item.quantity}</td>
              <td className="border px-2 py-1">₹{item.saleTotal.toFixed(2)}</td>
              <td className="border px-2 py-1">₹{item.costTotal.toFixed(2)}</td>
              <td className="border px-2 py-1 text-green-600">₹{item.profit.toFixed(2)}</td>
              <td className="border px-2 py-1 text-red-600">₹{item.loss.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 font-bold">
        Total Sales: ₹{data.totalSales.toFixed(2)} | Total Profit: ₹{data.totalProfit.toFixed(2)} | Total Loss: ₹{data.totalLoss.toFixed(2)} | Quantity Sold: {data.totalQuantitySold}
      </div>
    </div>
  );
}
