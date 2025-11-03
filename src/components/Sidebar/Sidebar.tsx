import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ import useLocation
import {
  LayoutDashboard,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  BarChart3,
  Truck,
  Settings,
  HelpCircle,
  Bell,
  PlusCircle,
  LogOut,
  User,
} from "lucide-react";

interface UserData {
  name: string;
  role: string;
  email: string;
  phone: string;
  photo?: string;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ used to detect current route

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || "User Name",
          role: parsedUser.role || "User Role",
          email: parsedUser.email || "demo@example.com",
          phone: parsedUser.phone || "+91 9999999999",
          photo: parsedUser.photo || "http://localhost:5173/images/akhila.jpeg",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login"); // ✅ use navigate instead of window.location
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/app/dashboard" },
    { name: "Inventory", icon: <Package size={22} />, path: "/app/inventory" },
    { name: "Stock In", icon: <ArrowDownCircle size={22} />, path: "/app/stock-in" },
    { name: "Stock Out", icon: <ArrowUpCircle size={22} />, path: "/app/stock-out" },
    { name: "Low Stock", icon: <AlertTriangle size={22} />, path: "/app/low-stock" },
    { name: "Reports", icon: <BarChart3 size={22} />, path: "/app/reports" },
    { name: "Supplier", icon: <Truck size={22} />, path: "/app/supplier" },
    { name: "Settings", icon: <Settings size={22} />, path: "/app/settings" },
    { name: "Help & Support", icon: <HelpCircle size={22} />, path: "/app/help" },
    { name: "Notifications", icon: <Bell size={22} />, path: "/app/notifications" },
    { name: "User Roles", icon: <User size={22} />, path: "/app/user-roles" },
  ];

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-64 min-h-screen flex flex-col bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e1b4b] text-white shadow-2xl border-r border-white/10 p-5 rounded-r-3xl"
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-4">
        {user && (
          <div className="flex flex-col items-center w-full">
            <img
              src={user.photo}
              alt="User"
              className="w-20 h-20 rounded-full border-4 border-white/30 shadow-md object-cover cursor-pointer transition hover:scale-105"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 text-center"
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-indigo-200">{user.role}</p>
              <p className="text-xs text-indigo-300">{user.email}</p>
              <p className="text-xs text-indigo-300">{user.phone}</p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="mt-8 flex-1 w-full space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path; // ✅ auto detect active route
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-6 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-xl"
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Bottom Quick Actions */}
      <div className="flex flex-col gap-3 mt-auto border-t border-white/20 pt-4">
        <button
          onClick={() => alert("Add Product clicked")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl shadow-md transition"
        >
          <PlusCircle size={18} />
          Add Product
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-xl shadow-md transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
