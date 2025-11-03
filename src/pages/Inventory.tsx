import React, { useEffect, useState } from "react";
import { message, Modal, Input, Select, Table } from "antd";
import { motion } from "framer-motion";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/productApi";
import { ProductDTO } from "@/types/productTypes";
import {
  PlusCircle,
  RefreshCcw,
  FileDown,
  Search,
  Filter,
} from "lucide-react";

const { Option } = Select;

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [formData, setFormData] = useState<ProductDTO>({
    productName: "",
    designCode: "",
    pattern: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch {
      message.error("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter + Search logic
  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.designCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter && categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.pattern === categoryFilter);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  const openModal = (product?: ProductDTO) => {
    setEditingProduct(product || null);
    setFormData(product || { productName: "", designCode: "", pattern: "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id!, formData);
        message.success("Product updated successfully");
      } else {
        await createProduct(formData);
        message.success("Product created successfully");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch {
      message.error("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch {
      message.error("Failed to delete product");
    }
  };

  const handleExportCSV = () => {
    const csvRows = [
      ["Name", "Design Code", "Pattern"],
      ...filteredProducts.map((p) => [p.productName, p.designCode, p.pattern]),
    ];
    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Design Code",
      dataIndex: "designCode",
      key: "designCode",
      render: (text: string) => (
        <span className="text-indigo-600 font-medium">{text}</span>
      ),
    },
    {
      title: "Pattern",
      dataIndex: "pattern",
      key: "pattern",
      render: (text: string) => (
        <span className="text-gray-700 font-medium">{text}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ProductDTO) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(record)}
            className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(record.id!)}
            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-800 tracking-tight">
          Inventory Management
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md transition"
          >
            <PlusCircle size={18} />
            Add Product
          </button>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md transition"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 shadow-md transition"
          >
            <FileDown size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
        {/* Search Bar */}
        <div className="flex items-center w-full sm:w-1/2 bg-white shadow-sm border border-indigo-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <Search size={18} className="text-gray-500 mr-2" />
          <Input
            placeholder="Search by product name or design code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bordered={false}
            className="text-gray-700"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-indigo-600" />
          <Select
            value={categoryFilter || "All"}
            onChange={(value) => setCategoryFilter(value)}
            className="w-48"
          >
            <Option value="All">All Patterns</Option>
            <Option value="Floral">Floral</Option>
            <Option value="Geometric">Geometric</Option>
            <Option value="Abstract">Abstract</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          className="custom-table"
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="Product Name"
          value={formData.productName}
          onChange={(e) =>
            setFormData({ ...formData, productName: e.target.value })
          }
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Design Code"
          value={formData.designCode}
          onChange={(e) =>
            setFormData({ ...formData, designCode: e.target.value })
          }
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Pattern"
          value={formData.pattern}
          onChange={(e) =>
            setFormData({ ...formData, pattern: e.target.value })
          }
          style={{ marginBottom: 10 }}
        />
      </Modal>

      {/* Custom Table Styling */}
      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background: linear-gradient(to right, #4f46e5, #6366f1);
          color: #fff;
          font-weight: 600;
          text-align: center;
          border: none;
        }
        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e5e7eb;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #eef2ff;
          transition: background 0.3s;
        }
        .ant-table {
          border-radius: 1rem;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default InventoryPage;
