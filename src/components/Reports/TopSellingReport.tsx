import React, { useMemo, useState } from "react";
import { DatePicker, Table, Select, message, InputNumber } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Search, Download } from "lucide-react";
import { getTopSellingProducts } from "@/api/reportApi";
import { exportToCSV } from "@/utils/csv";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TopSellingRow {
  productName: string;
  brandName: string;
  pattern: string;
  clothType: string;
  color: string;
  size: string;
  quantitySold: number;
  averageRate: number;
}

const TopSellingReport: React.FC = () => {
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().startOf("month"),
    dayjs()
  ]);
  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [pattern, setPattern] = useState<string | undefined>(undefined);
  const [clothType, setClothType] = useState<string | undefined>(undefined);
  const [limit, setLimit] = useState<number>(10);
  const [rows, setRows] = useState<TopSellingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "Product", dataIndex: "productName" },
    { title: "Brand", dataIndex: "brandName" },
    { title: "Pattern", dataIndex: "pattern" },
    { title: "Cloth Type", dataIndex: "clothType" },
    { title: "Color", dataIndex: "color" },
    { title: "Size", dataIndex: "size" },
    { title: "Quantity Sold", dataIndex: "quantitySold" },
    { title: "Avg Rate (Unit)", dataIndex: "averageRate" }
  ];

  const onSearch = async () => {
    const [start, end] = range;

    if (!start || !end) {
      message.warning("Please select a date range");
      return;
    }

    setLoading(true);

    try {
      const res = await getTopSellingProducts(
        start.format("YYYY-MM-DD"),
        end.format("YYYY-MM-DD"),
        limit
      );

      let data: TopSellingRow[] = (res || []).map((item: any): TopSellingRow => ({
        productName: item.productName ?? "-",
        brandName: item.brandName ?? "-",
        pattern: item.pattern ?? "-",
        clothType: item.clothType ?? "-",
        color: item.color ?? "-",
        size: item.size ?? "-",
        quantitySold: item.quantitySold ?? 0,
        averageRate: item.averageRate ?? 0
      }));

      if (brand) data = data.filter((d) => d.brandName === brand);
      if (pattern) data = data.filter((d) => d.pattern === pattern);
      if (clothType) data = data.filter((d) => d.clothType === clothType);

      setRows(data);
    } catch (err) {
      message.error("Failed to load Top Selling Products");
    }

    setLoading(false);
  };

  const brands = useMemo(
    () => Array.from(new Set(rows.map((r) => r.brandName))).filter(Boolean),
    [rows]
  );

  const patterns = useMemo(
    () => Array.from(new Set(rows.map((r) => r.pattern))).filter(Boolean),
    [rows]
  );

  const clothTypes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.clothType))).filter(Boolean),
    [rows]
  );

  const exportCsv = () =>
    exportToCSV(rows, columns, "top_selling_products.csv");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-indigo-800">Top Selling Products</h2>
        <button
          onClick={exportCsv}
          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <RangePicker value={range} onChange={(v) => setRange(v as any)} />
        <InputNumber
          min={1}
          max={200}
          value={limit}
          onChange={(v) => setLimit(Number(v))}
          placeholder="Limit"
        />

        <Select
          allowClear
          placeholder="Brand"
          className="min-w-[160px]"
          value={brand}
          onChange={setBrand}
        >
          {brands.map((b) => (
            <Option key={b} value={b}>
              {b}
            </Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="Pattern"
          className="min-w-[160px]"
          value={pattern}
          onChange={setPattern}
        >
          {patterns.map((p) => (
            <Option key={p} value={p}>
              {p}
            </Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="Cloth Type"
          className="min-w-[160px]"
          value={clothType}
          onChange={setClothType}
        >
          {clothTypes.map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Select>

        <button
          onClick={onSearch}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Search size={16} /> Search
        </button>
      </div>

      <Table
        rowKey={(r) => r.productName + r.color + r.size}
        columns={columns as any}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TopSellingReport;
