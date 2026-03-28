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
  sku: string;
  attributes: string;
  quantitySold: number;
  imageUrl?: string;
}

const TopSellingReport: React.FC = () => {
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [limit, setLimit] = useState<number>(10);

  const [rows, setRows] = useState<TopSellingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "Product", dataIndex: "productName" },
    { title: "Brand", dataIndex: "brandName" },
    { title: "SKU", dataIndex: "sku" },
    { title: "Attributes", dataIndex: "attributes" },
    { title: "Quantity Sold", dataIndex: "quantitySold" },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (url: string) =>
        url ? (
          <img
            src={url}
            alt="product"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          "-"
        ),
    },
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

      let data: TopSellingRow[] = (res || []).map((item: any) => ({
        productName: item.productName ?? "-",
        brandName: item.brandName ?? "-",
        sku: item.sku ?? "-",
        attributes: item.attributes ?? "-",
        quantitySold: item.quantitySold ?? 0,
        imageUrl: item.imageUrl ?? "",
      }));

      if (brand) data = data.filter((d) => d.brandName === brand);

      setRows(data);
    } catch {
      message.error("Failed to load Top Selling Products");
    }

    setLoading(false);
  };

  const brands = useMemo(
    () => Array.from(new Set(rows.map((r) => r.brandName))).filter(Boolean),
    [rows]
  );

  const exportCsv = () => exportToCSV(rows, columns, "top_selling_products.csv");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-indigo-800">
          Top Selling Products
        </h2>

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

        <button
          onClick={onSearch}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Search size={16} /> Search
        </button>
      </div>

      {/* Table */}
      <Table
        rowKey={(r) => r.sku}
        columns={columns as any}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TopSellingReport;