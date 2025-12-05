// Super Admin Sidebar + Layout (Glassmorphism)
// File: src/superadmin/layout/SuperAdminLayout.tsx
// Drop this into your project and wrap all Super Admin pages

import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  LogOut,
} from "lucide-react";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin";
  };

  return (
    <div className="flex min-h-screen bg-[url('/bg-glass.jpg')] bg-cover bg-center bg-fixed">
      {/* Sidebar */}
      <aside
        className="w-64 p-6 flex flex-col gap-6 bg-white/10 border-r border-white/20 backdrop-blur-2xl shadow-2xl text-white"
      >
        <h1 className="text-2xl font-bold drop-shadow-lg">Super Admin</h1>

        <nav className="flex flex-col gap-3">
          <SideItem to="/superadmin/dashboard" icon={<LayoutDashboard size={20} />}
            label="Dashboard" />

          <SideItem to="/superadmin/users" icon={<Users size={20} />} label="Users" />

          <SideItem to="/superadmin/roles" icon={<Shield size={20} />} label="Roles" />

          <SideItem to="/superadmin/permissions" icon={<Key size={20} />} label="Permissions" />
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

function SideItem({ to, icon, label }: any) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-xl transition backdrop-blur-lg border 
        ${isActive ? "bg-white/30 border-white/40 text-white font-semibold" : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

// Usage Example:
// Wrap all superadmin pages in this Layout.
// Example Router:
// <SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout>
