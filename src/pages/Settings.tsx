import React, { useState } from "react";
import ProfileSettings from "@/components/ProfileSettings/ProfileSettings";
import SecuritySettings from "@/components/ProfileSettings/SecuritySettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItem = (tab: string, label: string) => (
    <li
      onClick={() => setActiveTab(tab)}
      className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-200
      ${
        activeTab === tab
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {label}
    </li>
  );

  return (
    <div className="flex gap-6">

      {/* Left menu */}
      <div className="w-60 bg-white p-4 rounded-xl shadow-md h-fit">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Settings
        </h3>

        <ul className="space-y-2">
          {menuItem("profile", "Profile")}
          {menuItem("security", "Security")}
        </ul>
      </div>

      {/* Right content */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </div>

    </div>
  );
};

export default SettingsPage;