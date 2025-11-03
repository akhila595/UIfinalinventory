import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { stockOut } from "@/api/stockApi";

interface StockOutData {
  sku: string;
  quantity: string;
  saleDate: string;
  remarks: string;
  sellingPrice: string;
  finalPrice: string;
}

const StockOutForm: React.FC = () => {
  const [data, setData] = useState<StockOutData>({
    sku: "",
    quantity: "",
    saleDate: new Date().toISOString().slice(0, 16),
    remarks: "",
    sellingPrice: "",
    finalPrice: "",
  });

  const [message, setMessage] = useState<string>(""); // ✅ to display backend message
  const [isError, setIsError] = useState<boolean>(false); // ✅ to style message color

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      sku: data.sku.trim(),
      quantity: Number(data.quantity),
      saleDate: data.saleDate,
      remarks: data.remarks.trim(),
      sellingPrice: Number(data.sellingPrice),
      finalPrice: Number(data.finalPrice),
    };

    try {
      const response = await stockOut(payload);

      // ✅ Assume backend returns message as plain string
      const messageText =
        typeof response === "string"
          ? response
          : response?.message || "Stock out processed.";

      setMessage(messageText);
      setIsError(messageText.startsWith("❌")); // color based on backend symbol

      toast.success(messageText);

      // ✅ Reset form only if successful
      if (!messageText.startsWith("❌")) {
        setData({
          sku: "",
          quantity: "",
          saleDate: new Date().toISOString().slice(0, 16),
          remarks: "",
          sellingPrice: "",
          finalPrice: "",
        });
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.response?.data || "Failed to process stock out.";
      setMessage(errorMsg);
      setIsError(true);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Stock Out Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* SKU */}
        <div>
          <label className="block font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={data.sku}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100 focus:outline-none"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={data.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100 focus:outline-none"
          />
        </div>

        {/* Sale Date */}
        <div>
          <label className="block font-medium mb-1">Sale Date</label>
          <input
            type="datetime-local"
            name="saleDate"
            value={data.saleDate}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100 focus:outline-none"
          />
        </div>

        {/* Selling Price */}
        <div>
          <label className="block font-medium mb-1">Selling Price</label>
          <input
            type="number"
            name="sellingPrice"
            value={data.sellingPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100 focus:outline-none"
          />
        </div>

        {/* Final Price */}
        <div>
          <label className="block font-medium mb-1">Final Price</label>
          <input
            type="number"
            name="finalPrice"
            value={data.finalPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100 focus:outline-none"
          />
        </div>

        {/* Remarks */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={data.remarks}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
          >
            Process Stock Out
          </button>
        </div>
      </form>

      {/* ✅ Message Display Section */}
      {message && (
        <div
          className={`mt-6 text-center text-lg font-medium ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default StockOutForm;
