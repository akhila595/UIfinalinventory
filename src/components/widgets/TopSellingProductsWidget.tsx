import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { getTopSellingProducts } from "@/api/reportApi";

interface TopProduct {
  productName: string;
  quantitySold: number;
  imageUrl?: string;
}

interface TopSellingProductsWidgetProps {
  onFilterChange?: (filterType: string, startDate?: string, endDate?: string) => void;
}

const TopSellingProductsWidget: React.FC<TopSellingProductsWidgetProps> = ({
  onFilterChange,
}) => {
  const [filterType, setFilterType] = useState<string>("monthly");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const getImageUrl = (url?: string) =>
    !url
      ? "/images/pexels-jplenio-1103970.jpg"
      : url.startsWith("http")
      ? url
      : `${API_BASE}${url}`;

  const generateDateRange = (type: string) => {
    const today = new Date();
    let start: string, end: string;

    switch (type) {
      case "daily":
        start = end = today.toISOString().split("T")[0];
        break;
      case "weekly":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6);
        start = weekStart.toISOString().split("T")[0];
        end = today.toISOString().split("T")[0];
        break;
      case "monthly":
        const y = today.getFullYear();
        const m = today.getMonth();
        start = new Date(y, m, 1).toISOString().split("T")[0];
        end = new Date(y, m + 1, 0).toISOString().split("T")[0];
        break;
      case "yearly":
        const year = today.getFullYear();
        start = new Date(year, 0, 1).toISOString().split("T")[0];
        end = new Date(year, 11, 31).toISOString().split("T")[0];
        break;
      case "custom":
        start = startDate;
        end = endDate;
        break;
      default:
        start = end = today.toISOString().split("T")[0];
    }
    return { start, end };
  };

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = generateDateRange(filterType);
      if (!start || !end) {
        setError("Please select valid dates.");
        return;
      }

      const data = await getTopSellingProducts(start, end, 5);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching top selling products:", err);
      setError("Failed to load top-selling products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, [filterType, startDate, endDate]);

  const handleApply = () => {
    if (filterType === "custom" && (!startDate || !endDate)) {
      setError("Please select both start and end dates.");
      return;
    }
    setError(null);
    if (onFilterChange) {
      onFilterChange(filterType, startDate, endDate);
    }
    fetchTopProducts();
  };

  const filters = ["daily", "weekly", "monthly", "yearly", "custom"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-gradient-to-br from-[#bcdfff] via-[#cde7ff] to-[#e0f0ff] rounded-2xl shadow-xl border border-[#a3c9f3] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400/20 rounded-full shadow-sm">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#1f2d3d] tracking-wide">
            Top Selling Products
          </h2>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between mb-5">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterType === f
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={handleApply}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
        >
          Apply
        </button>
      </div>

      {/* Custom Date Picker */}
      <AnimatePresence>
        {filterType === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-3 mb-4"
          >
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow-sm"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-center text-red-500 italic text-sm mb-3">{error}</p>
      )}

      {/* Product List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[260px] pr-1">
        {loading ? (
          <p className="text-center text-gray-500 italic py-6">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-[#0f172a] italic text-center py-8">
            No products sold in this period.
          </p>
        ) : (
          products.map((product, idx) => (
            <motion.div
              key={product.productName}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[#dbeeff] hover:bg-white transition shadow-sm"
            >
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.productName}
                className="w-12 h-12 object-cover rounded-lg shadow-sm"
                onError={(e) =>
                  (e.currentTarget.src = "/images/pexels-jplenio-1103970.jpg")
                }
              />
              <div className="flex-1">
                <p className="font-medium text-[#0f172a] truncate">
                  {product.productName}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#059669]">
                {product.quantitySold} sold
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TopSellingProductsWidget;
