import React, { useEffect, useState } from "react";
import { Modal, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "@/api/axios";

const { Option } = Select;

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    brandId: undefined as number | undefined,
    categoryId: undefined as number | undefined,
    attributeIds: [] as number[],
  });

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // ✅ Check if required fields are filled
  const isFormValid =
    formData.name &&
    formData.brandId &&
    formData.categoryId &&
    formData.imageUrl;

  // ✅ Load master data
  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const [b, c, a] = await Promise.all([
        axios.get("/api/master/brands"),
        axios.get("/api/master/categories"),
        axios.get("/api/master/attributes"),
      ]);

      setBrands(b.data || []);
      setCategories(c.data || []);
      setAttributes(a.data || []);
    } catch {
      message.error("Failed to load dropdown data");
    }
  };

  // ✅ Image Upload
  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files allowed");
      return false;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      setUploading(true);

      const res = await axios.post(
        "/api/products/uploads/temp-image",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setFormData((prev) => ({
        ...prev,
        imageUrl: res.data.tempPath,
      }));

      message.success("Image uploaded successfully");
    } catch {
      message.error("Image upload failed");
    } finally {
      setUploading(false);
    }

    return false;
  };

  // ✅ Save Product
  const handleSave = async () => {
    if (!formData.name) return message.error("Product name is required");
    if (!formData.brandId) return message.error("Please select a brand");
    if (!formData.categoryId) return message.error("Please select a category");
    if (!formData.imageUrl)
      return message.error("Please upload product image");

    try {
      await axios.post("/api/products", formData);

      message.success("Product created successfully");

      // Reset form
      setFormData({
        name: "",
        imageUrl: "",
        brandId: undefined,
        categoryId: undefined,
        attributeIds: [],
      });

      onSuccess();
      onClose();
    } catch {
      message.error("Failed to create product");
    }
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Add Product</span>}
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save Product"
      okButtonProps={{ disabled: !isFormValid }}   // ✅ Disable button until valid
      width={700}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        {/* Brand */}
        <div>
          <label className="text-sm font-medium">
            Brand <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select Brand"
            className="w-full mt-1"
            value={formData.brandId}
            onChange={(v) => setFormData({ ...formData, brandId: v })}
          >
            {brands.map((b) => (
              <Option key={b.id} value={b.id}>
                {b.brand}
              </Option>
            ))}
          </Select>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select Category"
            className="w-full mt-1"
            value={formData.categoryId}
            onChange={(v) => setFormData({ ...formData, categoryId: v })}
          >
            {categories.map((c) => (
              <Option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </Option>
            ))}
          </Select>
        </div>

        {/* Attributes */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Attributes</label>
          <Select
            mode="multiple"
            placeholder="Select Attributes"
            className="w-full mt-1"
            value={formData.attributeIds}
            onChange={(v) =>
              setFormData({ ...formData, attributeIds: v })
            }
          >
            {attributes.map((a) => (
              <Option key={a.id} value={a.id}>
                {a.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            Product Image <span className="text-red-500">*</span>
          </label>

          <Upload beforeUpload={handleUpload} showUploadList={false}>
            <button
              disabled={uploading}
              className="mt-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <UploadOutlined /> Upload Image
            </button>
          </Upload>

          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          )}

          {formData.imageUrl && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${formData.imageUrl}`}
              alt="preview"
              className="mt-3 w-28 h-28 rounded object-cover border"
            />
          )}
        </div>

      </div>
    </Modal>
  );
};

export default ProductForm;