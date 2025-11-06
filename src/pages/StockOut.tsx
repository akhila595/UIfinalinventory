import React, { useEffect, useState } from "react";
import { PlusCircle, Search, Package } from "lucide-react";
import toast from "react-hot-toast";
import StockOutForm from "@/components/forms/StockOutForm";
import { getRecentStockOuts } from "@/api/stockApi";

const StockOutPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentStockOuts, setRecentStockOuts] = useState<any[]>([]);

  const fetchStockOuts = async () => {
    try {
      const res = await getRecentStockOuts();
      setRecentStockOuts(res || []);
    } catch (err) {
      toast.error("Failed to fetch recent stock-outs");
    }
  };

  useEffect(() => {
    fetchStockOuts();
  }, []);

  const filteredStockOuts = recentStockOuts.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.sku?.toLowerCase().includes(term) ||
      s.productName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-indigo-600" /> Stock Out Management
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          <PlusCircle size={18} /> Record Stock-Out
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white border rounded-lg px-4 py-2 mb-6 shadow-sm w-full md:w-1/2">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by SKU or product..."
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
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Qty Out</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredStockOuts.length > 0 ? (
              filteredStockOuts.map((s, i) => (
                <tr
                  key={i}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="p-3">{i + 1}</td>

                  {/* Product + Image */}
                  <td className="p-3 flex items-center gap-3">
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt={s.productName}
                        className="w-10 h-10 rounded object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                        🛍
                      </div>
                    )}
                    <span className="font-medium text-gray-800">{s.productName}</span>
                  </td>

                  <td className="p-3 font-semibold text-gray-800">{s.sku}</td>
                  <td className="p-3 text-indigo-700 font-bold">{s.quantityRemoved}</td>
                  <td className="p-3">{s.reason || "-"}</td>
                  <td className="p-3">
                    {s.stockOutDate
                      ? new Date(s.stockOutDate).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No recent stock-outs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-6 text-gray-400 hover:text-indigo-600 text-3xl font-bold"
            >
              &times;
            </button>

            <StockOutForm
              onSuccess={() => {
                setShowForm(false);
                fetchStockOuts();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockOutPage;
