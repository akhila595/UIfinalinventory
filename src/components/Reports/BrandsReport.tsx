import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { Search, FileDown } from "lucide-react";
import { getBrands } from "@/api/masterDataApi";

const BrandsReport: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await getBrands();
      setBrands(res);
      setFiltered(res);
    } catch {
      message.error("Failed to fetch brands");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFiltered(
      brands.filter((b) =>
        b.brand.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, brands]);

  const exportCSV = () => {
    const rows = [["Brand Name"], ...filtered.map((b) => [b.brand])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brands_report.csv";
    a.click();
  };

  return (
    <div>
      {/* Search + Export */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center bg-white border rounded-lg px-3 py-1 shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search brands..."
            className="outline-none px-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
        >
          <FileDown size={18} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <Table
        dataSource={filtered}
        rowKey="id"
        columns={[{ title: "Brand Name", dataIndex: "brand" }]}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BrandsReport;
