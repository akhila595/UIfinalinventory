import React, { useEffect, useState } from "react";
import { getTopSellingProducts } from "@/api/reportApi" // Import the API function

interface TopSellingProduct {
  productName: string;
  quantitySold: number;
}

export default function TopSellingProductsReport() {
  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const defaultStart = lastMonth.toISOString().split("T")[0];

  const [products, setProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);
  const [limit, setLimit] = useState(10);

  const fetchData = () => {
    setLoading(true);
    getTopSellingProducts(startDate, endDate, limit) // Use the API helper function
      .then((res) => {
        setProducts(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top-selling products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, limit]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label>
          📅 Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
            className="ml-2 border rounded px-2 py-1"
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
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        <label>
          🔢 Top:
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
          </select>
        </label>
      </div>

      <h2 className="text-xl font-bold mb-4">
        ⭐ Top Selling Products ({startDate} to {endDate})
      </h2>

      {loading ? (
        <p>Loading Top Selling Products...</p>
      ) : products.length === 0 ? (
        <p>No top selling products found for the selected range.</p>
      ) : (
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.productName}</td>
                <td className="border px-2 py-1">{item.quantitySold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
