import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { Download } from "lucide-react";
import { getLowStockProducts } from "@/api/reportApi";
import { exportToCSV } from "@/utils/csv";

const LowStockReport: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "Product", dataIndex: "productName" },
    { title: "SKU", dataIndex: "sku" },
    { title: "Stock Qty", dataIndex: "stockQty" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getLowStockProducts();
      setRows(res || []);
    } catch {
      message.error("Failed to load Low Stock");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const exportCsv = () => exportToCSV(rows, columns, "low_stock.csv");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-indigo-800">Low Stock</h2>
        <button onClick={exportCsv} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center gap-2">
          <Download size={16}/> Export CSV
        </button>
      </div>
      <Table
        rowKey={(r: any, i) => String(i)}
        columns={columns as any}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LowStockReport;
