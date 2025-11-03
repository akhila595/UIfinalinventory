import React, { useEffect, useState } from "react";
import {
  getCategories,
  getBrands,
  getClothTypes,
  getColors,
  getSizes,
} from "@/api/masterDataApi";
import { stockIn } from "@/api/stockApi";
import toast from "react-hot-toast";

const StockInForm: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    categoryId: "",
    brandId: "",
    clothTypeId: "",
    colorId: "",
    sizeId: "",
    designCode: "",
    pattern: "",
    sku: "",
    quantity: "",
    basePrice: "",
    taxPerUnit: "",
    transportPerUnit: "",
    sellingPrice: "",
    purchaseDate: "",
    supplierName: "",
    remarks: "",
    productName: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [clothTypes, setClothTypes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [cat, br, cloth, col, sz] = await Promise.all([
        getCategories(),
        getBrands(),
        getClothTypes(),
        getColors(),
        getSizes(),
      ]);

      setCategories(cat || []);
      setBrands(br || []);
      setClothTypes(cloth || []);
      setColors(col || []);
      setSizes(sz || []);
    } catch (err) {
      toast.error("Failed to load dropdown data");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      if (image) payload.append("image", image);

      await stockIn(payload);
      toast.success("Stock In record saved successfully!");

      setFormData({
        categoryId: "",
        brandId: "",
        clothTypeId: "",
        colorId: "",
        sizeId: "",
        designCode: "",
        pattern: "",
        sku: "",
        quantity: "",
        basePrice: "",
        taxPerUnit: "",
        transportPerUnit: "",
        sellingPrice: "",
        purchaseDate: "",
        supplierName: "",
        remarks: "",
        productName: "",
      });
      setImage(null);
    } catch (err) {
      toast.error("Failed to save stock in record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-white p-10 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <h2 className="col-span-3 text-3xl font-bold text-blue-700 mb-4 border-b-2 border-blue-200 pb-3">
        Stock In Entry
      </h2>

      {/* --- Dropdown Fields --- */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
        <select
          name="brandId"
          value={formData.brandId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.brand}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Cloth Type</label>
        <select
          name="clothTypeId"
          value={formData.clothTypeId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Cloth Type</option>
          {clothTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.clothType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
        <select
          name="colorId"
          value={formData.colorId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Color</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.color}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Size</label>
        <select
          name="sizeId"
          value={formData.sizeId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Size</option>
          {sizes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.size}
            </option>
          ))}
        </select>
      </div>

      {/* --- Text Inputs --- */}
      {[
        { label: "Product Name", name: "productName" },
        { label: "Design Code", name: "designCode" },
        { label: "Pattern", name: "pattern" },
        { label: "SKU", name: "sku" },
        { label: "Quantity", name: "quantity", type: "number" },
        { label: "Base Price", name: "basePrice", type: "number" },
        { label: "Tax per Unit", name: "taxPerUnit", type: "number" },
        { label: "Transport per Unit", name: "transportPerUnit", type: "number" },
        { label: "Selling Price", name: "sellingPrice", type: "number" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
          <input
            type={field.type || "text"}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Date</label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier Name</label>
        <input
          type="text"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="col-span-3">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 h-24 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="col-span-3">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* --- Submit Button --- */}
      <div className="col-span-3 flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Stock In"}
        </button>
      </div>
    </form>
  );
};

export default StockInForm;
