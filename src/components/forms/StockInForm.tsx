import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllProducts,
  getProductAttributes,
  getAttributeValues,
  stockIn,
} from "@/api/stockApi";

interface StockInFormProps {
  onSuccess?: () => void;
}

const StockInForm: React.FC<StockInFormProps> = ({ onSuccess }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any>({});

  const [formData, setFormData] = useState<any>({
    productId: "",
    attributeValueIds: [],
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    taxPerUnit: "",
    transportPerUnit: "",
    purchaseDate: "",
    supplierName: "",
    remarks: "",
  });

  const [selectedValues, setSelectedValues] = useState<any>({});
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  /* =========================
     PRODUCT SELECT
  ========================= */

  const handleProductChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const productId = Number(e.target.value);

    setFormData({ ...formData, productId });
    setSelectedValues({});
    setAttributes([]);
    setAttributeValues({});

    try {
      const attrs = await getProductAttributes(productId);
      setAttributes(attrs);

      const valuesMap: any = {};

      for (const attr of attrs) {
        const values = await getAttributeValues(attr.id);
        valuesMap[attr.id] = values;
      }

      setAttributeValues(valuesMap);
    } catch {
      toast.error("Failed to load attributes");
    }
  };

  /* =========================
     ATTRIBUTE SELECT
  ========================= */

  const handleAttributeSelect = (
    attributeId: number,
    valueId: number
  ) => {
    const updated = {
      ...selectedValues,
      [attributeId]: valueId,
    };

    setSelectedValues(updated);

    const ids = Object.values(updated);
    setFormData({ ...formData, attributeValueIds: ids });
  };

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error("Select product");
      return;
    }

    if (formData.attributeValueIds.length !== attributes.length) {
      toast.error("Select all attribute values");
      return;
    }

    setLoading(true);

    try {
      await stockIn(formData);

      toast.success("Stock added successfully");

      setFormData({
        productId: "",
        attributeValueIds: [],
        quantity: "",
        costPrice: "",
        sellingPrice: "",
        taxPerUnit: "",
        transportPerUnit: "",
        purchaseDate: "",
        supplierName: "",
        remarks: "",
      });

      setAttributes([]);
      setSelectedValues({});
      onSuccess?.();
    } catch {
      toast.error("Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  const Required = () => (
    <span className="text-red-500 ml-1">*</span>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <h2 className="col-span-3 text-2xl font-bold text-indigo-700 border-b pb-2">
        Stock In Entry
      </h2>

      {/* PRODUCT */}

      <div>
        <label className="font-semibold">
          Product <Required />
        </label>

        <select
          value={formData.productId}
          onChange={handleProductChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* ATTRIBUTES */}

      {attributes.map((attr) => (
        <div key={attr.id}>
          <label className="font-semibold">
            {attr.name} <Required />
          </label>

          <select
            value={selectedValues[attr.id] || ""}
            onChange={(e) =>
              handleAttributeSelect(
                attr.id,
                Number(e.target.value)
              )
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select {attr.name}</option>

            {attributeValues[attr.id]?.map((v: any) => (
              <option key={v.id} value={v.id}>
                {v.value}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* QUANTITY */}

      <div>
        <label className="font-semibold">
          Quantity <Required />
        </label>

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* COST PRICE */}

      <div>
        <label className="font-semibold">
          Cost Price <Required />
        </label>

        <input
          type="number"
          name="costPrice"
          value={formData.costPrice}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* SELLING PRICE */}

      <div>
        <label className="font-semibold">
          Selling Price <Required />
        </label>

        <input
          type="number"
          name="sellingPrice"
          value={formData.sellingPrice}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* TAX */}

      <div>
        <label className="font-semibold">Tax Per Unit</label>

        <input
          type="number"
          name="taxPerUnit"
          value={formData.taxPerUnit}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* TRANSPORT */}

      <div>
        <label className="font-semibold">Transport Per Unit</label>

        <input
          type="number"
          name="transportPerUnit"
          value={formData.transportPerUnit}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* PURCHASE DATE */}

      <div>
        <label className="font-semibold">
          Purchase Date <Required />
        </label>

        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* SUPPLIER */}

      <div>
        <label className="font-semibold">Supplier Name</label>

        <input
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* REMARKS */}

      <div className="col-span-3">
        <label className="font-semibold">Remarks</label>

        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 h-24"
        />
      </div>

      {/* SUBMIT */}

      <div className="col-span-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save Stock"}
        </button>
      </div>
    </form>
  );
};

export default StockInForm;