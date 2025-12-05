import React, { useState } from "react";
import { Shield, Users } from "lucide-react";
import RoleManagement from "./RoleManagement";
import UserRoleManagement from "./UserRoleManagement";

const UserRolesMain: React.FC = () => {
  const [activePage, setActivePage] = useState<"home" | "roles" | "users">("home");

  // 🟦 Role Management Page
  if (activePage === "roles") {
    return <RoleManagement goBack={() => setActivePage("home")} />;
  }

  // 🟩 User Role Management Page
  if (activePage === "users") {
    return <UserRoleManagement goBack={() => setActivePage("home")} />;
  }

  // 🟪 Main Selection Page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">
        User Roles Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Role Management Card */}
        <div
          onClick={() => setActivePage("roles")}
          className="cursor-pointer bg-white shadow-md hover:shadow-lg p-8 rounded-2xl flex flex-col items-center justify-center border hover:border-indigo-600 transition"
        >
          <Shield className="text-indigo-600 mb-3" size={40} />
          <h2 className="text-xl font-semibold text-gray-800">
            Role Management
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Create, edit, or delete roles and manage their permissions.
          </p>
        </div>

        {/* User Role Management Card */}
        <div
          onClick={() => setActivePage("users")}
          className="cursor-pointer bg-white shadow-md hover:shadow-lg p-8 rounded-2xl flex flex-col items-center justify-center border hover:border-indigo-600 transition"
        >
          <Users className="text-indigo-600 mb-3" size={40} />
          <h2 className="text-xl font-semibold text-gray-800">
            User Role Management
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Assign or modify roles for existing users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRolesMain;
