import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { Search, FileDown } from "lucide-react";
import { getClothTypes } from "@/api/masterDataApi";

const ClothTypesReport: React.FC = () => {
  const [types, setTypes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await getClothTypes();
      setTypes(res);
      setFiltered(res);
    } catch {
      message.error("Failed to fetch cloth types");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFiltered(
      types.filter((t) =>
        t.clothType.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, types]);

  const exportCSV = () => {
    const rows = [["Cloth Type"], ...filtered.map((t) => [t.clothType])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cloth_types_report.csv";
    a.click();
  };

  return (
    <div>
      {/* Search + Export */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center bg-white border rounded-lg px-3 py-1 shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search cloth types..."
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
        columns={[{ title: "Cloth Type", dataIndex: "clothType" }]}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ClothTypesReport;
