import React, { useState } from "react";
import { DatePicker, Table, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Search, Download } from "lucide-react";
import { getAllSuppliersPurchaseReport } from "@/api/reportApi";
import { exportToCSV } from "@/utils/csv";

const { RangePicker } = DatePicker;

const SuppliersPurchaseReport: React.FC = () => {
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs().startOf("month"), dayjs()]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "Supplier", dataIndex: "supplierName" },
    { title: "Purchase Date", dataIndex: "purchaseDate" },
    { title: "Product", dataIndex: "productName" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Threshold Price", dataIndex: "thresholdPrice" },
  ];

  const onSearch = async () => {
    const [start, end] = range;
    if (!start || !end) { message.warning("Please select a date range"); return; }
    setLoading(true);
    try {
      const res = await getAllSuppliersPurchaseReport(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
      setRows(res || []);
    } catch {
      message.error("Failed to load Suppliers Purchase Report");
    }
    setLoading(false);
  };

  const exportCsv = () => exportToCSV(rows, columns, "suppliers_purchase.csv");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-indigo-800">All Suppliers Purchase Report</h2>
        <button onClick={exportCsv} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center gap-2">
          <Download size={16}/> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <RangePicker value={range} onChange={(v) => setRange(v as any)} />
        <button
          onClick={onSearch}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Search size={16}/> Search
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

export default SuppliersPurchaseReport;
