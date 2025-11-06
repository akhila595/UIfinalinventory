import React, { useEffect, useState } from "react";
import { Search, TriangleAlert, Info } from "lucide-react";
import toast from "react-hot-toast";
import { getLowStockProducts, getMonthlyReport } from "@/api/reportApi";

const LowStockPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [enrichedItems, setEnrichedItems] = useState<any[]>([]);
  const today = new Date();

  const fetchLowStock = async () => {
    try {
      const res = await getLowStockProducts();
      setLowStockItems(res || []);
    } catch {
      toast.error("Failed to fetch low stock items");
    }
  };

  const fetchMonthlySales = async () => {
    try {
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const monthlyData = await getMonthlyReport(year, month);

      const salesMap: Record<string, number> = {};
      monthlyData.productSales.forEach((item: any) => {
        salesMap[item.productName] = (salesMap[item.productName] || 0) + item.quantity;
      });

      const combined = lowStockItems.map((item) => {
        const monthlySales = salesMap[item.productName] || 0;
        const velocity = monthlySales / 30;
        const score = velocity / (item.stockQty + 1);

        let priority = "Low";
        if (score > 1.5) priority = "High";
        else if (score >= 0.5) priority = "Medium";

        return { ...item, monthlySales, velocity, priority };
      });

      setEnrichedItems(combined);
    } catch {
      toast.error("Failed to fetch monthly sales data");
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  useEffect(() => {
    if (lowStockItems.length > 0) fetchMonthlySales();
  }, [lowStockItems]);

  const filteredItems = enrichedItems.filter((item) =>
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary counts
  const totalLow = filteredItems.length;
  const outOfStock = filteredItems.filter((i) => i.stockQty === 0).length;
  const veryLow = filteredItems.filter((i) => i.stockQty > 0 && i.stockQty <= 3).length;

  const getPriorityBadge = (priority: string) => {
    const styles: any = {
      High: "bg-red-100 text-red-700",
      Medium: "bg-orange-100 text-orange-700",
      Low: "bg-yellow-100 text-yellow-700",
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[priority]}`}>
        {priority} Demand
      </span>
    );
  };

  const getStockColor = (qty: number) => {
    if (qty === 0) return "text-red-600 font-bold";
    if (qty <= 3) return "text-orange-600 font-bold";
    return "text-yellow-600 font-semibold";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <TriangleAlert className="text-indigo-600" />
          Low Stock Report
        </h1>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <Info size={16} className="text-indigo-500" />
          Priority is calculated based on <strong>last month’s sales</strong>.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md border rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Low Stock Items</p>
          <p className="text-2xl font-bold text-indigo-700">{totalLow}</p>
        </div>

        <div className="bg-white shadow-md border rounded-xl p-4">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
        </div>

        <div className="bg-white shadow-md border rounded-xl p-4">
          <p className="text-sm text-gray-500">Very Low (1–3 Qty)</p>
          <p className="text-2xl font-bold text-orange-500">{veryLow}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border rounded-lg px-4 py-2 mb-6 shadow-sm w-full md:w-1/2">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 outline-none px-2 text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Stock Qty</th>
              <th className="p-3 text-left">Monthly Sales</th>
              <th className="p-3 text-left">Priority</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, i) => (
                <tr
                  key={i}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium text-gray-800">{item.productName}</td>
                  <td className="p-3 text-gray-700">{item.sku || "-"}</td>
                  <td className={`p-3 ${getStockColor(item.stockQty)}`}>{item.stockQty}</td>
                  <td className="p-3 text-gray-700">{item.monthlySales}</td>
                  <td className="p-3">{getPriorityBadge(item.priority)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                  No low stock items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockPage;
