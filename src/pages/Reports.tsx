import React, { useState } from "react";
import {
  FileBarChart2,
  Grid,
  PackageSearch,
  TrendingUp,
  Users,
  Layers,
} from "lucide-react";

// REPORT COMPONENTS
import CategoryReport from "@/components/Reports/CategoryReport";
import BrandsReport from "@/components/Reports/BrandsReport";
import TopSellingReport from "@/components/Reports/TopSellingReport";
import LowStockReport from "@/components/Reports/LowStockReport";
import SuppliersPurchaseReport from "@/components/Reports/SuppliersPurchaseReport";
import AttributesReport from "@/components/Reports/AttributesReport";

type ReportKey =
  | "category"
  | "brand"
  | "topSelling"
  | "lowStock"
  | "suppliers"
  | "attributes";

const tabs: {
  key: ReportKey;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    key: "category",
    label: "Category Report",
    icon: <Grid />,
    desc: "View all product categories",
  },
  {
    key: "brand",
    label: "Brand Report",
    icon: <Grid />,
    desc: "View available brands",
  },
  {
    key: "topSelling",
    label: "Top Selling Products",
    icon: <TrendingUp />,
    desc: "View best selling product variants",
  },
  {
    key: "lowStock",
    label: "Low Stock",
    icon: <PackageSearch />,
    desc: "Products running low in inventory",
  },
  {
    key: "suppliers",
    label: "Suppliers Purchase",
    icon: <Users />,
    desc: "Purchase history from suppliers",
  },
  {
    key: "attributes",
    label: "Attributes Report",
    icon: <Layers />,
    desc: "View attributes and their values",
  },
];

const ReportsPage: React.FC = () => {
  const [active, setActive] = useState<ReportKey>("category");

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
          <FileBarChart2 className="text-indigo-600" /> Reports
        </h1>
      </div>

      {/* Report Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`text-left p-4 rounded-xl border shadow-sm hover:shadow-md transition ${
              active === t.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white border-indigo-100"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <span
                className={active === t.key ? "text-white" : "text-indigo-600"}
              >
                {t.icon}
              </span>
              {t.label}
            </div>

            <p
              className={`text-sm mt-1 ${
                active === t.key ? "text-indigo-100" : "text-gray-500"
              }`}
            >
              {t.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Active Report Display */}
      <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-4">
        {active === "category" && <CategoryReport />}
        {active === "brand" && <BrandsReport />}
        {active === "topSelling" && <TopSellingReport />}
        {active === "lowStock" && <LowStockReport />}
        {active === "suppliers" && <SuppliersPurchaseReport />}
        {active === "attributes" && <AttributesReport />}
      </div>
    </div>
  );
};

export default ReportsPage;