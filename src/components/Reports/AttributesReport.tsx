import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { Download } from "lucide-react";
import { getAttributesReport } from "@/api/reportApi";
import { exportToCSV } from "@/utils/csv";

interface AttributeRow {
  attributeName: string;
  values: string[];
}

const AttributesReport: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Attribute",
      dataIndex: "attributeName",
    },
    {
      title: "Values",
      dataIndex: "values",
      render: (values: string[]) => values?.join(", ") || "-",
    },
    {
      title: "Total Values",
      dataIndex: "count",
    },
  ];

  const fetchData = async () => {
    setLoading(true);

    try {
      const res: AttributeRow[] = await getAttributesReport();

      const formatted = (res || []).map((item) => ({
        attributeName: item.attributeName,
        values: item.values,
        count: item.values?.length || 0,
      }));

      setRows(formatted);
    } catch (err) {
      message.error("Failed to load Attributes Report");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportCsv = () =>
    exportToCSV(rows, columns, "attributes_report.csv");

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-indigo-800">
          Attributes Report
        </h2>

        <button
          onClick={exportCsv}
          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <Table
        rowKey={(r) => r.attributeName}
        columns={columns as any}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "No attributes found" }}
      />

    </div>
  );
};

export default AttributesReport;