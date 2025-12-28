import React, { useEffect, useState } from "react";
import {
  getCategories,
  getBrands,
  getClothTypes,
  getColors,
  getSizes,
} from "@/api/masterDataApi";
import { getAllProducts } from "@/api/productApi";
import { stockIn } from "@/api/stockApi";
import toast from "react-hot-toast";

interface StockInFormProps {
  onSuccess?: () => void;
}

const StockInForm: React.FC<StockInFormProps> = ({ onSuccess }) => {
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
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [cat, br, cloth, col, sz, prod] = await Promise.all([
        getCategories(),
        getBrands(),
        getClothTypes(),
        getColors(),
        getSizes(),
        getAllProducts(),
      ]);

      setCategories(cat || []);
      setBrands(br || []);
      setClothTypes(cloth || []);
      setColors(col || []);
      setSizes(sz || []);
      setProducts(prod?.data || []);
    } catch {
      toast.error("Failed to load dropdown data");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const numericFields = [
      "categoryId",
      "brandId",
      "clothTypeId",
      "colorId",
      "sizeId",
    ];

    const parsedValue = numericFields.includes(name)
      ? Number(value)
      : value;

    const updatedForm = { ...formData, [name]: parsedValue };

    const categoryName =
      categories.find((c) => c.categoryId === updatedForm.categoryId)
        ?.categoryName || "";
    const colorName =
      colors.find((c) => c.id === updatedForm.colorId)?.color || "";
    const sizeName =
      sizes.find((s) => s.id === updatedForm.sizeId)?.size || "";
    const designCode = updatedForm.designCode || "";

    updatedForm.sku =
      categoryName && designCode
        ? `${categoryName}-${designCode}-${colorName}-${sizeName}`.replace(
            /\s+/g,
            ""
          )
        : "";

    setFormData(updatedForm);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const isFormValid =
    formData.categoryId &&
    formData.productName &&
    formData.quantity &&
    formData.basePrice &&
    formData.sellingPrice &&
    formData.purchaseDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append(
        "data",
        new Blob([JSON.stringify(formData)], {
          type: "application/json",
        })
      );
      if (image) payload.append("image", image);

      const res = await stockIn(payload);

      // ✅ ONLY CHANGE: show backend message using alert
      alert(res);

      onSuccess?.();

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
    } catch (err: any) {
      alert(
        err?.response?.data ||
          err?.message ||
          "Failed to save stock in record"
      );
    } finally {
      setLoading(false);
    }
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-white p-10 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <h2 className="col-span-3 text-3xl font-bold text-blue-700 mb-4 border-b pb-3">
        Stock In Entry
      </h2>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Category <RequiredStar />
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-semibold mb-1">Brand</label>
        <select
          name="brandId"
          value={formData.brandId}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.brand}
            </option>
          ))}
        </select>
      </div>

      {/* Cloth Type */}
      <div>
        <label className="block text-sm font-semibold mb-1">Cloth Type</label>
        <select
          name="clothTypeId"
          value={formData.clothTypeId}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Cloth Type</option>
          {clothTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.clothType}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold mb-1">Color</label>
        <select
          name="colorId"
          value={formData.colorId}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Color</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.color}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-semibold mb-1">Size</label>
        <select
          name="sizeId"
          value={formData.sizeId}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Size</option>
          {sizes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.size}
            </option>
          ))}
        </select>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Product Name <RequiredStar />
        </label>
        <select
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.productName}>
              {p.productName}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      {[
        { label: "Design Code", name: "designCode" },
        { label: "Pattern", name: "pattern" },
        { label: "Quantity", name: "quantity", type: "number", required: true },
        { label: "Base Price", name: "basePrice", type: "number", required: true },
        { label: "Tax per Unit", name: "taxPerUnit", type: "number" },
        { label: "Transport per Unit", name: "transportPerUnit", type: "number" },
        {
          label: "Selling Price",
          name: "sellingPrice",
          type: "number",
          required: true,
        },
      ].map((f) => (
        <div key={f.name}>
          <label className="block text-sm font-semibold mb-1">
            {f.label} {f.required && <RequiredStar />}
          </label>
          <input
            type={f.type || "text"}
            name={f.name}
            value={formData[f.name]}
            onChange={handleChange}
            required={f.required}
            className="w-full border rounded-lg p-2"
          />
        </div>
      ))}

      {/* SKU */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          SKU (Auto Generated)
        </label>
        <input
          value={formData.sku}
          readOnly
          className="w-full border rounded-lg p-2 bg-gray-100"
        />
      </div>

      {/* Purchase Date */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Purchase Date <RequiredStar />
        </label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Supplier */}
      <div>
        <label className="block text-sm font-semibold mb-1">Supplier Name</label>
        <input
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Remarks */}
      <div className="col-span-3">
        <label className="block text-sm font-semibold mb-1">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 h-24"
        />
      </div>

      {/* Image */}
      <div className="col-span-3">
        <label className="block text-sm font-semibold mb-1">Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* Submit */}
      <div className="col-span-3 flex justify-end">
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`px-6 py-2 rounded-lg text-white ${
            !isFormValid || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Stock In"}
        </button>
      </div>
    </form>
  );
};

export default StockInForm;
