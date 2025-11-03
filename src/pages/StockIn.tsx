import React, { useState, useEffect } from "react";
import { PlusCircle, Upload, Search, Package } from "lucide-react";
import { toast } from "react-hot-toast";
import StockInForm from "@/components/forms/StockInForm";
import { getRecentStockIns } from "@/api/stockApi";

const StockInPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentStock, setRecentStock] = useState<any[]>([]);

  // Fetch recent stock-in records on mount
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await getRecentStockIns();
        setRecentStock(res || []);
      } catch {
        toast.error("Failed to fetch recent restocks");
      }
    };
    fetchStock();
  }, []);

  // Filter by product name
  const filteredStock = recentStock.filter((s) =>
    s.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-indigo-600" /> Stock In Management
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <PlusCircle size={18} /> Add New Stock
          </button>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => toast("Excel Upload coming soon")}
          >
            <Upload size={18} /> Upload Excel
          </button>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Recent Stock Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.length > 0 ? (
              filteredStock.map((s, i) => (
                <tr
                  key={i}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold text-gray-800">
                    {s.productName}
                  </td>
                  <td className="p-3">{s.sku}</td>
                  <td className="p-3 text-indigo-700 font-bold">
                    {s.quantityAdded}
                  </td>
                  <td className="p-3">{s.supplierName}</td>
                  <td className="p-3">
                    {new Date(s.stockInDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt={s.productName}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No recent stock-ins available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stock-In Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-6 text-gray-400 hover:text-red-600 text-3xl font-bold"
            >
              &times;
            </button>
            <StockInForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockInPage;
