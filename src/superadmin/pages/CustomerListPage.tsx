import React, { useEffect, useState } from "react";
import {
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
  getCustomerAdmins,
} from "@/api/SuperadminApi";
import { Building2, Mail, Phone, UserCog, Trash2, Pencil, ArrowLeft } from "lucide-react"; // ✅ Added Back Icon
import { useNavigate } from "react-router-dom";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const navigate = useNavigate(); // ✅ for navigation

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      alert("Customer deleted successfully!");
      loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer.");
    }
  };

  const handleViewAdmin = async (id: number, name: string) => {
    try {
      const adminData = await getCustomerAdmins(id);
      setAdmins([adminData]);
      alert(`Admin for ${name}: ${adminData.email}`);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch admin details.");
    }
  };

  const handleEdit = (c: any) => setEditingCustomer({ ...c });

  const handleSave = async () => {
    if (!editingCustomer) return;
    try {
      await updateCustomer(editingCustomer.id, editingCustomer);
      alert("Customer updated successfully!");
      setEditingCustomer(null);
      loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Failed to update customer.");
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Back Button and Title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)} // Go back to previous page
            className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition"
            aria-label="Back"
          >
            <ArrowLeft className="text-purple-700" size={22} />
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            <Building2 className="text-purple-600" /> Customers
          </h1>
        </div>

        {customers.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No customers found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((c) => (
              <div
                key={c.id}
                className="bg-white/80 p-5 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-800">{c.customerName}</h2>
                  <UserCog className="text-purple-600" />
                </div>

                <p className="flex items-center gap-2 text-gray-700 text-sm">
                  <Mail size={14} className="text-purple-500" />
                  {c.email}
                </p>
                <p className="flex items-center gap-2 text-gray-700 text-sm">
                  <Phone size={14} className="text-purple-500" />
                  {c.phone}
                </p>
                <p className="text-xs text-gray-500 mt-1">{c.address}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 rounded-lg"
                    onClick={() => handleViewAdmin(c.id, c.customerName)}
                  >
                    View Admin
                  </button>

                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1.5 rounded-lg"
                    onClick={() => handleEdit(c)}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✏️ Edit Customer Modal */}
        {editingCustomer && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Customer</h2>

              <input
                type="text"
                placeholder="Customer Name"
                className="border w-full mb-3 px-3 py-2 rounded-lg"
                value={editingCustomer.customerName}
                onChange={(e) =>
                  setEditingCustomer({ ...editingCustomer, customerName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Email"
                className="border w-full mb-3 px-3 py-2 rounded-lg"
                value={editingCustomer.email}
                onChange={(e) =>
                  setEditingCustomer({ ...editingCustomer, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                className="border w-full mb-3 px-3 py-2 rounded-lg"
                value={editingCustomer.phone}
                onChange={(e) =>
                  setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="border w-full mb-3 px-3 py-2 rounded-lg"
                value={editingCustomer.address}
                onChange={(e) =>
                  setEditingCustomer({ ...editingCustomer, address: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
