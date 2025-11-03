import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface LowStockProduct {
  productName: string;
  stockQty: number;
}

interface LowStockWidgetProps {
  products: LowStockProduct[];
}

const LowStockWidget: React.FC<LowStockWidgetProps> = ({ products }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-gradient-to-br from-[#bcdfff] via-[#cde7ff] to-[#e0f0ff] rounded-2xl shadow-xl border border-[#a3c9f3] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-400/20 rounded-full shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-[#1f2d3d]">Low Stock Alerts</h2>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1">
        {products.length === 0 ? (
          <p className="text-[#0f172a] italic text-center py-8">
            ✅ All products in good stock!
          </p>
        ) : (
          products.map((item, index) => (
            <motion.div
              key={item.productName}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex justify-between items-center p-3 rounded-xl bg-white/60 border border-[#dbeeff] hover:bg-white/70 transition shadow-sm"
            >
              <span className="font-medium text-[#0f172a] truncate">
                {item.productName}
              </span>
              <span className="text-sm font-semibold text-red-500">
                {item.stockQty} left
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default LowStockWidget;
