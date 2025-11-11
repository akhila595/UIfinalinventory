import React, { useEffect, useState } from "react";
import { Search, UserPlus, RefreshCcw, Trash2, Pencil, History } from "lucide-react";
import { Table, message } from "antd";
import SupplierFormModal from "@/components/forms/SupplierFormModal";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/api/supplierApi";
import { getSupplierPurchaseHistory } from "@/api/reportApi";

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    supplierName: "",
    contactPerson: "",
    phoneNumber: "",
    whatsApp: "",
    email: "",
    address: "",
    gstNumber: "",
    paymentTerms: "",
    notes: "",
  });

  // History Drawer State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers();
      setSuppliers(res);
      setFiltered(res);
    } catch {
      message.error("Failed to fetch suppliers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFiltered(
      suppliers.filter((s) =>
        s.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, suppliers]);

  const openModal = (supplier?: any) => {
    setFormData(
      supplier || {
        supplierName: "",
        contactPerson: "",
        phoneNumber: "",
        whatsApp: "",
        email: "",
        address: "",
        gstNumber: "",
        paymentTerms: "",
        notes: "",
      }
    );
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (formData.supplierId) {
        await updateSupplier(formData.supplierId, formData);
        message.success("Supplier updated");
      } else {
        await createSupplier(formData);
        message.success("Supplier added");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      message.error("Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(id);
      message.success("Supplier deleted");
      fetchData();
    } catch {
      message.error("Delete failed");
    }
  };

  // Purchase History Drawer
  const openHistory = async (supplier: any) => {
    setSelectedSupplier(supplier);
    setHistoryOpen(true);
    setHistoryLoading(true);

    try {
      const today = new Date();
      const endDate = today.toISOString().split("T")[0];
      const past = new Date();
      past.setMonth(today.getMonth() - 1);
      const startDate = past.toISOString().split("T")[0];

      const res = await getSupplierPurchaseHistory(supplier.supplierId, startDate, endDate);
      setHistoryData(res);
    } catch {
      message.error("Failed to fetch purchase history");
    }

    setHistoryLoading(false);
  };

  const columns = [
    { title: "Name", dataIndex: "supplierName" },
    { title: "Contact Person", dataIndex: "contactPerson" },
    { title: "Phone", dataIndex: "phoneNumber" },
    { title: "Address", dataIndex: "address" },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(record)}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => handleDelete(record.supplierId)}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => openHistory(record)}
            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition flex items-center gap-1"
          >
            <History size={14} /> History
          </button>
        </div>
      ),
    },
  ];

  const totalSuppliers = filtered.length;
  const suppliersWithPhone = filtered.filter((s) => s.phoneNumber?.trim()).length;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-800">Supplier Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <UserPlus size={18} /> Add Supplier
          </button>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <RefreshCcw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow-sm hover:shadow-md border border-indigo-100 rounded-xl p-5 transition">
          <p className="text-sm text-gray-500">Total Suppliers</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{totalSuppliers}</p>
        </div>

        <div className="bg-white shadow-sm hover:shadow-md border border-indigo-100 rounded-xl p-5 transition">
          <p className="text-sm text-gray-500">Suppliers With Phone Number</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{suppliersWithPhone}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border rounded-lg px-4 py-2 mb-6 shadow-sm w-full md:w-1/2">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search supplier..."
          className="flex-1 px-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="supplierId"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Modal */}
      <SupplierFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />

      {/* History Drawer */}
      {historyOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full sm:w-[420px] h-full shadow-xl p-6 overflow-y-auto">

            <h2 className="text-xl font-bold text-indigo-700 mb-4">
              {selectedSupplier?.supplierName} - Purchase History (Last 30 Days)
            </h2>

            {historyLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : historyData.length === 0 ? (
              <p className="text-gray-500 italic">No purchases found</p>
            ) : (
              <div className="space-y-3">
                {historyData.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 border rounded-lg hover:bg-indigo-50 transition">
                    <p className="font-semibold text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-600">Date: {item.purchaseDate}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ₹ {item.thresholdPrice}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setHistoryOpen(false)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPage;
