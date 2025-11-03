import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import {
  getMonthlyReport,
  getWeeklyReport,
  getDailyReport,
  getYearlyReport,
} from "@/api/reportApi";

interface ProfitLossWidgetProps {
  data?: { name: string; value: number }[];
  year?: number;
  month?: number;
}

const ProfitLossWidget: React.FC<ProfitLossWidgetProps> = ({
  data = [],
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
}) => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(data);
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null); // State for handling no data message

  const COLORS = ["#34d399", "#f87171"]; // Green = Profit, Red = Loss

  // Helper: Format chart data
  const formatChartData = (resData: any) => [
    { name: "Profit", value: resData?.totalProfit ?? 0 },
    { name: "Loss", value: resData?.totalLoss ?? 0 },
  ];

  // Fetch report data dynamically based on selected period
  const fetchReportData = async () => {
    try {
      let resData: any;

      if (selectedPeriod === "day") {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        resData = await getDailyReport(dateStr);
        console.log("Daily report:", dateStr, resData);
      } 
      else if (selectedPeriod === "week") {
        const curr = new Date(selectedDate);
        const first = curr.getDate() - curr.getDay() + 1; // Monday
        const last = first + 6; // Sunday

        const startDate = new Date(curr.getFullYear(), curr.getMonth(), first)
          .toLocaleDateString("en-CA");
        const endDate = new Date(curr.getFullYear(), curr.getMonth(), last)
          .toLocaleDateString("en-CA");

        console.log("Weekly range:", startDate, endDate);

        resData = await getWeeklyReport(startDate, endDate);
        console.log("Weekly report:", resData);
      } 
      else if (selectedPeriod === "month") {
        const y = selectedDate.getFullYear();
        const m = selectedDate.getMonth() + 1;
        resData = await getMonthlyReport(y, m);
        console.log("Monthly report:", y, m, resData);
      } 
      else if (selectedPeriod === "year") {
        const y = selectedDate.getFullYear();
        resData = await getYearlyReport(y);
        console.log("Yearly report:", y, resData);
      }

      if (resData) {
        const formattedData = formatChartData(resData);
        if (formattedData[0].value === 0 && formattedData[1].value === 0) {
          setNoDataMessage("No data available for the selected period.");
        } else {
          setNoDataMessage(null); // Clear message if data is present
        }
        setChartData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching profit/loss data:", error);
      setNoDataMessage("Error fetching data. Please try again.");
    }
  };

  // Fetch whenever period or date changes
  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, selectedDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-gradient-to-br from-[#bcdfff] via-[#cde7ff] to-[#e0f0ff] rounded-2xl shadow-xl border border-[#a3c9f3] p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#38bdf8]/20 rounded-full shadow-sm">
            <DollarSign className="w-5 h-5 text-[#38bdf8]" />
          </div>
          <h2 className="text-lg font-semibold text-[#1f2d3d]">Profit vs Loss</h2>
        </div>

        {/* Period Selection */}
        <div className="flex items-center gap-2">
          {/* Period Dropdown */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:ring focus:ring-blue-200"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>

          {/* Date / Month / Year Selector */}
          <input
            type={selectedPeriod === "day" ? "date" : selectedPeriod === "month" ? "month" : selectedPeriod === "year" ? "number" : "date"}
            value={selectedPeriod === "year" ? selectedDate.getFullYear().toString() : selectedPeriod === "month" ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}` : selectedDate.toISOString().split("T")[0]}
            min="2000"
            max="2100"
            onChange={(e) => {
              if (selectedPeriod === "year") {
                const newDate = new Date(Number(e.target.value), 0, 1);
                setSelectedDate(newDate);
              } else {
                setSelectedDate(new Date(e.target.value));
              }
            }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Conditional rendering: Pie chart or message */}
      <div className="w-full rounded-2xl bg-[#f3f9ff] p-2">
        {noDataMessage ? (
          <div className="flex justify-center items-center h-40 text-lg font-semibold text-[#1d8de2]">
            {noDataMessage}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ₹${value}`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value}`}
                contentStyle={{
                  backgroundColor: "rgba(243, 249, 255, 0.95)",
                  borderRadius: 10,
                  border: "1px solid rgba(163,201,243,0.6)",
                  color: "#1f2d3d",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ProfitLossWidget;
