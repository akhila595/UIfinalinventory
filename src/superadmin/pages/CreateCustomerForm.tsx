import React, { useState } from "react";
import { createCustomerWithAdmin } from "@/api/SuperadminApi";
import { useNavigate } from "react-router-dom";
import { UserCog, X } from "lucide-react"; // ✅ Added X icon

export default function CreateCustomerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCustomerWithAdmin(form);
      alert("✅ Customer and admin created successfully!");
      navigate("/superadmin/customers");
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to create customer. Please check inputs or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-lg mx-auto bg-white/90 p-6 rounded-2xl shadow-lg border border-purple-200 relative">
        {/* ✅ Close icon */}
        <button
          onClick={() => navigate("/superadmin/customers")}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserCog className="text-purple-600" /> Create Customer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-gray-700">Customer Details</h2>
          <input name="name" placeholder="Customer Name" className="input" onChange={handleChange} required />
          <input name="email" placeholder="Customer Email" className="input" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" className="input" onChange={handleChange} required />
          <input name="address" placeholder="Address" className="input" onChange={handleChange} required />
          <input name="gstNumber" placeholder="GST Number" className="input" onChange={handleChange} required />

          <hr className="my-4" />

          <h2 className="font-semibold text-gray-700">Admin User Details</h2>
          <input name="adminName" placeholder="Admin Name" className="input" onChange={handleChange} required />
          <input name="adminEmail" placeholder="Admin Email" className="input" onChange={handleChange} required />
          <input type="password" name="adminPassword" placeholder="Admin Password" className="input" onChange={handleChange} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg mt-3 font-semibold transition"
          >
            {loading ? "Creating..." : "Create Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}
