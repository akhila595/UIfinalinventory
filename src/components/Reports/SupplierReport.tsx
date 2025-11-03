import React, { useEffect, useState } from "react";
import { getAllSuppliersPurchaseReport } from "@/api/reportApi"; // Import the API function

interface SupplierData {
  supplierName: string;
  productName: string;
  quantity: number;
  thresholdPrice: number;
  purchaseDate: string;
}

export default function SupplierReport() {
  const today = new Date().toISOString().split("T")[0];

  // Default: Past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const defaultStartDate = thirtyDaysAgo.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(today);
  const [data, setData] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    getAllSuppliersPurchaseReport(startDate, endDate) // Use the imported API function
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching supplier report:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      {/* Date Range Selector */}
      <div className="flex items-center gap-4 mb-4">
        <label>
          📅 Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
            className="border rounded px-2 py-1 ml-2"
          />
        </label>
        <label>
          🗓 End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={today}
            className="border rounded px-2 py-1 ml-2"
          />
        </label>
      </div>

      <h2 className="text-xl font-bold mb-4">
        🏭 Supplier Report ({startDate} to {endDate})
      </h2>

      {loading ? (
        <p>Loading Supplier Report...</p>
      ) : data.length === 0 ? (
        <p>No data available for the selected range.</p>
      ) : (
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Supplier</th>
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Threshold Price</th>
              <th className="border px-2 py-1">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.supplierName}</td>
                <td className="border px-2 py-1">{item.productName}</td>
                <td className="border px-2 py-1">{item.quantity}</td>
                <td className="border px-2 py-1">₹{item.thresholdPrice.toFixed(2)}</td>
                <td className="border px-2 py-1">{item.purchaseDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
