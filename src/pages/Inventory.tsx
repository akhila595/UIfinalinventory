import React, { useEffect, useState } from "react";
import { message, Modal, Input, Select, Table } from "antd";
import type { TableProps } from "antd";
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
  Lock,
} from "lucide-react";

const { Option } = Select;

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [patterns, setPatterns] = useState<string[]>([]);
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

  // ✅ Load permissions from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const permissions: string[] = userData.permissions || [];

  const hasPermission = (code: string) => permissions.includes(code);

  // ✅ Permission flags
  const canView = hasPermission("PRODUCT_VIEW");
  const canAdd = hasPermission("PRODUCT_ADD");
  const canEdit = hasPermission("PRODUCT_EDIT");
  const canDelete = hasPermission("PRODUCT_DELETE");

  // ❌ If user cannot view products — block entirely
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <Lock size={50} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-500">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  // ✅ Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data);
      setFilteredProducts(res.data);

      const uniquePatterns = Array.from(
        new Set(
          res.data.map((p: ProductDTO): string =>
            (p.pattern ?? "").toString().trim()
          )
        )
      ).filter((p): p is string => p !== "");

      setPatterns(uniquePatterns);
    } catch {
      message.error("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // ✅ CRUD actions
  const openModal = (product?: ProductDTO) => {
    setEditingProduct(product || null);
    setFormData(product || { productName: "", designCode: "", pattern: "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        if (!canEdit) {
          message.warning("You don’t have permission to edit products.");
          return;
        }
        await updateProduct(editingProduct.id!, formData);
        message.success("Product updated successfully");
      } else {
        if (!canAdd) {
          message.warning("You don’t have permission to add products.");
          return;
        }
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
    if (!canDelete) {
      message.warning("You don’t have permission to delete products.");
      return;
    }

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

  // ✅ Columns (Actions depend on permission)
  const columns: TableProps<ProductDTO>["columns"] = [
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
  ];

  // ✅ Add Actions column only if edit/delete permissions exist
  if (canEdit || canDelete) {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (_: any, record: ProductDTO) => (
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => openModal(record)}
              className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => handleDelete(record.id!)}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition"
            >
              Delete
            </button>
          )}
        </div>
      ),
    });
  }

  // ✅ UI
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-800 tracking-tight">
          Inventory Management
        </h1>

        <div className="flex gap-3">
          {canAdd && (
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md transition"
            >
              <PlusCircle size={18} />
              Add Product
            </button>
          )}
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
        <div className="flex items-center w-full sm:w-1/2 bg-white shadow-sm border border-indigo-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bordered={false}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-indigo-600" />
          <Select
            value={categoryFilter || "All"}
            onChange={(value) => setCategoryFilter(value)}
            className="w-48"
          >
            <Option value="All">All Patterns</Option>
            {patterns.map((pattern, index) => (
              <Option key={index} value={pattern}>
                {pattern}
              </Option>
            ))}
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
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
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
    </motion.div>
  );
};

export default InventoryPage;
