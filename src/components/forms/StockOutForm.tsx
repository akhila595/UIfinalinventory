import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  stockOut,
  getAllProducts,
  getVariantsByProduct,
} from "@/api/stockApi";

interface StockOutFormProps {
  onSuccess?: () => void;
}

const StockOutForm: React.FC<StockOutFormProps> = ({ onSuccess }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  const [form, setForm] = useState({
    quantity: "",
    finalPrice: "",
    remarks: "",
  });

  const [submitting, setSubmitting] = useState(false);

  /* ================================
     LOAD PRODUCTS
  ================================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch {
        toast.error("Failed to load products");
      }
    };

    loadProducts();
  }, []);

  /* ================================
     LOAD VARIANTS WHEN PRODUCT CHANGES
  ================================= */

  const handleProductChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const productId = Number(e.target.value);

    setSelectedProduct(productId);
    setSelectedVariant(null);

    try {
      const data = await getVariantsByProduct(productId);
      setVariants(data);
    } catch {
      toast.error("Failed to load variants");
    }
  };

  /* ================================
     VARIANT SELECT
  ================================= */

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantId = Number(e.target.value);

    const variant = variants.find((v) => v.variantId === variantId);

    setSelectedVariant(variant);

    if (variant) {
      setForm((prev) => ({
        ...prev,
        finalPrice: variant.sellingPrice,
      }));
    }
  };

  /* ================================
     INPUT CHANGE
  ================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================================
     SUBMIT
  ================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (!form.quantity) {
      toast.error("Enter quantity");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        sku: selectedVariant.sku,
        quantity: Number(form.quantity),
        saleDate: new Date().toISOString(),
        remarks: form.remarks,
        finalPrice: Number(form.finalPrice),
      };

      const res = await stockOut(payload);

      toast.success(res);

      onSuccess?.();

      setForm({
        quantity: "",
        finalPrice: "",
        remarks: "",
      });

      setSelectedVariant(null);
      setVariants([]);
    } catch (err: any) {
      toast.error(
        err?.response?.data || err?.message || "Failed to record stock-out"
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
        {/* PRODUCT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product
          </label>

          <select
            onChange={handleProductChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">Select Product</option>

            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* VARIANT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variant
          </label>

          <select
            onChange={handleVariantChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">Select Variant</option>

            {variants.map((v) => (
              <option key={v.variantId} value={v.variantId}>
                {v.sku}
              </option>
            ))}
          </select>
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>

          <input
            value={selectedVariant?.sku || ""}
            disabled
            className="border rounded-md px-3 py-2 w-full bg-gray-100"
          />
        </div>

        {/* AVAILABLE STOCK */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Stock
          </label>

          <input
            value={selectedVariant?.stockQty || ""}
            disabled
            className="border rounded-md px-3 py-2 w-full bg-gray-100"
          />
        </div>

        {/* FINAL PRICE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Final Price
          </label>

          <input
            name="finalPrice"
            value={form.finalPrice}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* QUANTITY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>

          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            min={1}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* REMARKS */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>

          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows={3}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* SUBMIT */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            {submitting ? "Saving..." : "Record Stock Out"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockOutForm;