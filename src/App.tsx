import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";

// Import your actual pages
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import StockInPage from "@/pages/StockIn";

import StockOutPage from "@/pages/StockOut";
import LowStockPage from "@/pages/LowStock";
/*import ReportsPage from "@/pages/Reports";
import SupplierPage from "@/pages/Supplier";
import SettingsPage from "@/pages/Settings";
import HelpPage from "@/pages/Help";
import NotificationsPage from "@/pages/Notifications";
import UserRolesPage from "@/pages/UserRoles";*/

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Routes>
          {/* Redirect /app to /app/dashboard */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />

          {/* Core Modules */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="stock-in" element={<StockInPage />} />
          <Route path="stock-out" element={<StockOutPage />} />
         <Route path="low-stock" element={<LowStockPage />} />
          {/*<Route path="reports" element={<ReportsPage />} />
          <Route path="supplier" element={<SupplierPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="user-roles" element={<UserRolesPage />} />*/}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
