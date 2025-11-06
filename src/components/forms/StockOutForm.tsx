import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { stockOut } from "@/api/stockApi";

interface StockOutFormProps {
  onSuccess?: () => void;
}

const StockOutForm: React.FC<StockOutFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState({
    sku: "",
    quantity: "",
    remarks: "",
    sellingPrice: "",
    finalPrice: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.sku || !form.quantity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        sku: form.sku.trim(),
        quantity: Number(form.quantity),
        saleDate: new Date().toISOString(),
        remarks: form.remarks,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : null,
        finalPrice: form.finalPrice ? Number(form.finalPrice) : null,
      };

      await stockOut(payload);
      toast.success("Stock-out recorded successfully!");
      onSuccess?.();

      setForm({
        sku: "",
        quantity: "",
        remarks: "",
        sellingPrice: "",
        finalPrice: "",
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to record stock-out."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Record Stock Out
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="Enter SKU"
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            min={1}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        {/* Selling Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price (per unit)
          </label>
          <input
            name="sellingPrice"
            value={form.sellingPrice}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Final Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Final Price (per unit)
          </label>
          <input
            name="finalPrice"
            value={form.finalPrice}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Remarks */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason / Remarks
          </label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={3}
            placeholder="Reason for stock-out (sale, damage, return, etc.)"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60 transition font-medium shadow"
          >
            {submitting ? "Saving..." : "Record Stock Out"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockOutForm;
