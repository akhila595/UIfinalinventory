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
} from "lucide-react";
import { getDashboardStats } from "@/api/SuperadminApi";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  totalLogs: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard error", err);
    }
    setLoading(false);
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Manage Users • Roles • Permissions • System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 bg-white border border-purple-200 rounded-xl shadow-md 
                         hover:bg-purple-50 transition text-gray-900"
            >
              Control Panel
            </button>

            {/* ✅ Logout Button */}
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

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard>
            <StatBox label="Total Users" value={stats?.totalUsers} icon={<Users />} />
          </GlassCard>

          <GlassCard>
            <StatBox label="Roles" value={stats?.totalRoles} icon={<Shield />} />
          </GlassCard>

          <GlassCard>
            <StatBox label="Permissions" value={stats?.totalPermissions} icon={<Key />} />
          </GlassCard>

          <GlassCard>
            <StatBox label="System Logs" value={stats?.totalLogs} icon={<FileText />} />
          </GlassCard>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionBox label="Create User" icon={<UserPlus />} onClick={() => navigate("/superadmin/users")} />

            <ActionBox label="Manage Roles" icon={<Shield />} onClick={() => navigate("/superadmin/roles")} />

            <ActionBox label="Assign Role → User" icon={<ListChecks />} onClick={() => navigate("/superadmin/users")} />

            <ActionBox label="Create Permission" icon={<Lock />} onClick={() => navigate("/superadmin/permissions")} />
          </div>
        </section>

        {/* Activity + Status */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="h-[360px] p-6 flex flex-col">
            <h2 className="text-gray-900 font-semibold text-lg mb-4">Recent Activity</h2>

            <div className="flex-1 overflow-auto space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/70 border border-purple-200 
                             shadow-sm p-3 rounded-xl text-gray-800 text-sm"
                >
                  <Activity size={18} className="text-purple-600" /> Activity log entry #{i}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-[360px] p-6 flex flex-col">
            <h2 className="text-gray-900 font-semibold text-lg mb-4">System Status</h2>

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

/* COMPONENTS */

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
      <div
        className="w-12 h-12 flex items-center justify-center bg-purple-200 
                    text-purple-700 rounded-xl shadow-sm"
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
      </div>
    </div>
  );
}

function ActionBox({ label, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-white/70 border border-purple-200 
                 shadow-md backdrop-blur-lg p-4 rounded-xl text-gray-900 
                 hover:bg-purple-50 transition w-full text-left"
    >
      <div
        className="w-10 h-10 bg-purple-200 rounded-xl flex items-center 
                    justify-center text-purple-700 shadow-sm"
      >
        {icon}
      </div>
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function StatusRow({ label, value, icon }: any) {
  return (
    <div
      className="flex items-center justify-between bg-white/70 border border-purple-200 
                  p-3 rounded-xl shadow-sm mb-2"
    >
      <div className="flex items-center gap-2 text-gray-800">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-emerald-600 font-semibold">{value}</span>
    </div>
  );
}
