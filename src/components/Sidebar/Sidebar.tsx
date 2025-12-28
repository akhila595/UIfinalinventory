import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  BarChart3,
  Truck,
  User,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
  permissions: string[];
  profileImage?: string | null;
}

const DEFAULT_IMAGE = "/images/default-user.jpeg";

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  // 🔒 Prevent fallback loops
  const imageFailedRef = useRef(false);

  // ✅ Load user ONCE
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name,
        email: parsed.email,
        permissions: parsed.permissions || [],
        profileImage: parsed.profileImage || null,
      });
    }
    setUserLoaded(true);
  }, []);

  // ✅ Decide image BEFORE render
  const profileImageSrc = useMemo(() => {
    if (imageFailedRef.current) return DEFAULT_IMAGE;

    if (!user?.profileImage) return DEFAULT_IMAGE;

    return user.profileImage.startsWith("http")
      ? user.profileImage
      : `${API_BASE}${user.profileImage}`;
  }, [user?.profileImage, API_BASE]);

  const hasPermission = (perm: string | null) => {
    if (perm === null) return true;
    return user?.permissions?.includes(perm);
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/app/dashboard", permission: null },
    { name: "Inventory", icon: <Package size={22} />, path: "/app/inventory", permission: "INVENTORY_VIEW" },
    { name: "Stock In", icon: <ArrowDownCircle size={22} />, path: "/app/stock-in", permission: "STOCK_IN_MANAGE" },
    { name: "Stock Out", icon: <ArrowUpCircle size={22} />, path: "/app/stock-out", permission: "STOCK_OUT_MANAGE" },
    { name: "Low Stock", icon: <AlertTriangle size={22} />, path: "/app/low-stock", permission: "LOW_STOCK_VIEW" },
    { name: "Reports", icon: <BarChart3 size={22} />, path: "/app/reports", permission: "REPORT_VIEW" },
    { name: "Supplier", icon: <Truck size={22} />, path: "/app/supplier", permission: "SUPPLIER_VIEW" },
    { name: "Manage Users", icon: <Users size={22} />, path: "/app/users", permission: "USER_VIEW" },
    { name: "User Roles", icon: <User size={22} />, path: "/app/user-roles", permission: "ROLE_MANAGE" },
    { name: "Settings", icon: <Settings size={22} />, path: "/app/settings", permission: "SYSTEM_SETTINGS_EDIT" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-64 min-h-screen flex flex-col bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e1b4b] text-white shadow-2xl border-r border-white/10 p-5 rounded-r-3xl"
    >
      {/* 👤 User Info */}
      {userLoaded && user && (
        <div className="flex flex-col items-center gap-3">
          <img
            src={profileImageSrc}
            onError={() => {
              imageFailedRef.current = true;
            }}
            className="w-20 h-20 rounded-full border-4 border-white/30 shadow-md object-cover"
            alt="User Profile"
          />
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-indigo-200">{user.email}</p>
        </div>
      )}

      {/* 📋 Menu */}
      <div className="mt-8 flex-1 space-y-2">
        {menuItems.map(
          (item) =>
            hasPermission(item.permission) && (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 w-full px-6 py-3 rounded-xl transition ${
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            )
        )}
      </div>

      {/* 🚪 Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-xl shadow-md transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;
