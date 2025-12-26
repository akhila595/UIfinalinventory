import React, { useEffect, useState } from "react";
import {
  Users,
  Shield,
  Key,
  FileText,
  UserPlus,
  ListChecks,
  Lock,
  Activity,
  Gauge,
  Cpu,
  Database,
  LogOut,
  Building2,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getAllCustomers } from "@/api/SuperadminApi";
import { useCustomer } from "@/superadmin/components/CustomerContext";

interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  totalLogs: number;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const { customerId, customerName, setCustomer, clearCustomer } = useCustomer();

  const [customers, setCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const isCustomerSelected = !!customerId;

  // ===============================
  // Load customers (Superadmin only)
  // ===============================
  useEffect(() => {
    getAllCustomers()
      .then(setCustomers)
      .catch(() => console.error("Failed to load customers"));
  }, []);

  // ===============================
  // Load dashboard stats (ONLY after customer selected)
  // ===============================
  useEffect(() => {
    if (customerId) {
      loadStats();
    } else {
      setStats(null);
    }
  }, [customerId]);

  const loadStats = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Logout
  // ===============================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Manage Customers • Users • Roles • Permissions • System
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Customer Dropdown */}
            <select
              value={customerId ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                if (!id) {
                  clearCustomer();
                  return;
                }
                const selected = customers.find(c => c.id === id);
                setCustomer(id, selected?.customerName || "");
              }}
              className="px-3 py-2 rounded-xl border border-purple-300 
                         bg-white text-gray-900 shadow-sm"
            >
              <option value="" className="text-gray-500">
                Select Customer
              </option>
              {customers.map(c => (
                <option
                  key={c.id}
                  value={c.id}
                  className="text-gray-900"
                >
                  {c.customerName}
                </option>
              ))}
            </select>

            {customerName && (
              <span className="text-sm font-medium text-gray-700">
                {customerName}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl shadow-md
                         hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* ================= WARNING ================= */}
        {!isCustomerSelected && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-xl text-sm">
            Please select a customer to view dashboard data and perform actions.
          </div>
        )}

        {/* ================= STATS ================= */}
        {isCustomerSelected && !loading && stats && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard>
              <StatBox label="Total Users" value={stats.totalUsers} icon={<Users />} />
            </GlassCard>

            <GlassCard>
              <StatBox label="Roles" value={stats.totalRoles} icon={<Shield />} />
            </GlassCard>

            <GlassCard>
              <StatBox label="Permissions" value={stats.totalPermissions} icon={<Key />} />
            </GlassCard>

            <GlassCard>
              <StatBox label="System Logs" value={stats.totalLogs} icon={<FileText />} />
            </GlassCard>
          </section>
        )}

        {/* ================= QUICK ACTIONS ================= */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionBox
              label="Manage Customers"
              icon={<Building2 />}
              onClick={() => navigate("/superadmin/customers")}
            />

            <ActionBox
              label="Create Customer"
              icon={<UserCog />}
              onClick={() => navigate("/superadmin/create-customer")}
            />

            <ActionBox
              label="Create User"
              icon={<UserPlus />}
              disabled={!isCustomerSelected}
              onClick={() => navigate("/superadmin/users")}
            />

            <ActionBox
              label="Manage Roles"
              icon={<Shield />}
              disabled={!isCustomerSelected}
              onClick={() => navigate("/superadmin/roles")}
            />

            <ActionBox
              label="Assign Role → User"
              icon={<ListChecks />}
              disabled={!isCustomerSelected}
              onClick={() => navigate("/superadmin/users")}
            />

            <ActionBox
              label="Create Permission"
              icon={<Lock />}
              disabled={!isCustomerSelected}
              onClick={() => navigate("/superadmin/permissions")}
            />
          </div>
        </section>

        {/* ================= SYSTEM STATUS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="h-[360px] p-6 flex flex-col">
            <h2 className="text-gray-900 font-semibold text-lg mb-4">
              Recent Activity
            </h2>

            <div className="flex-1 overflow-auto space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/70 border border-purple-200 
                             shadow-sm p-3 rounded-xl text-gray-800 text-sm"
                >
                  <Activity size={18} className="text-purple-600" />
                  Activity log entry #{i}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-[360px] p-6 flex flex-col">
            <h2 className="text-gray-900 font-semibold text-lg mb-4">
              System Status
            </h2>

            <StatusRow label="API" value="Online" icon={<Gauge />} />
            <StatusRow label="Server CPU" value="Healthy" icon={<Cpu />} />
            <StatusRow label="Database" value="Connected" icon={<Database />} />
            <StatusRow label="Auth System" value="Running" icon={<Shield />} />
          </GlassCard>
        </section>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function GlassCard({ children, className = "" }: any) {
  return (
    <div
      className={`rounded-2xl border border-purple-200 bg-white/60 backdrop-blur-xl shadow-xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function StatBox({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center bg-purple-200 
                      text-purple-700 rounded-xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ActionBox({ label, icon, onClick, disabled }: any) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center gap-3 p-4 rounded-xl w-full text-left transition
        ${disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white/70 border border-purple-200 shadow-md hover:bg-purple-50"
        }`}
    >
      <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center text-purple-700">
        {icon}
      </div>
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function StatusRow({ label, value, icon }: any) {
  return (
    <div className="flex items-center justify-between bg-white/70 border border-purple-200 
                    p-3 rounded-xl shadow-sm mb-2">
      <div className="flex items-center gap-2 text-gray-800">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-emerald-600 font-semibold">{value}</span>
    </div>
  );
}
