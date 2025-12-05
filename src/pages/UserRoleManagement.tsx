import React, { useEffect, useState } from "react";
import { Table, Modal, Select, Tag, Spin, Alert } from "antd";
import {
  Users,
  UserCheck,
  UserPlus,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import axios from "@/api/axios";
import { getUsers, getRoles, getUserRoles } from "@/api/SuperadminApi";

const { Option } = Select;

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  assignedRoles?: Role[];
}

interface Props {
  goBack: () => void;
}

const UserRoleManagement: React.FC<Props> = ({ goBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  // Alert banner state
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  // ==========================
  // FETCH DATA
  // ==========================
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);

      // Attach roles to each user
      const usersWithRoles = await Promise.all(
        usersData.map(async (u: User) => {
          const assigned = await getUserRoles(u.id);
          return { ...u, assignedRoles: assigned };
        })
      );

      setUsers(usersWithRoles || []);
      setRoles(rolesData || []);
      setStatusMessage(null);
    } catch (err) {
      console.error("Failed to load user roles:", err);
      setStatusType("error");
      setStatusMessage("Failed to load users or roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================
  // OPEN MODAL (For existing or new user)
  // ==========================
  const openAssignModal = async (user?: User) => {
    if (user) {
      try {
        const userRoles = await getUserRoles(user.id);
        setSelectedUser(user);
        setSelectedUserId(user.id);
        setSelectedRoleIds(userRoles.map((r: Role) => r.id));
      } catch {
        setStatusType("error");
        setStatusMessage("Failed to fetch roles for this user.");
      }
    } else {
      // Fresh assignment (no preselected user)
      setSelectedUser(null);
      setSelectedUserId(null);
      setSelectedRoleIds([]);
    }
    setIsModalOpen(true);
  };

  // ==========================
  // SAVE ASSIGNMENT
  // ==========================
  const handleSaveUserRoles = async () => {
    const userIdToAssign = selectedUser?.id || selectedUserId;
    if (!userIdToAssign) {
      setStatusType("warning");
      setStatusMessage("Please select a user first.");
      return;
    }

    try {
      await axios.post("/api/roles/assign", {
        userId: userIdToAssign,
        roleIds: selectedRoleIds,
      });
      setStatusType("success");
      setStatusMessage(
        `Roles assigned successfully for ${
          selectedUser?.name || "selected user"
        }.`
      );
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error assigning roles:", err);
      setStatusType("error");
      setStatusMessage("Failed to assign roles. Please try again.");
    }
  };

  // ==========================
  // TABLE COLUMNS
  // ==========================
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Assigned Roles",
      key: "roles",
      render: (_: any, record: User) =>
        record.assignedRoles && record.assignedRoles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {record.assignedRoles.map((r: Role) => (
              <Tag key={r.id} color="blue">
                {r.name}
              </Tag>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 italic">No roles assigned</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => {
        const hasRoles = record.assignedRoles && record.assignedRoles.length > 0;
        return (
          <button
            onClick={() => openAssignModal(record)}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-white ${
              hasRoles
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {hasRoles ? <UserCheck size={14} /> : <UserPlus size={14} />}
            {hasRoles ? "Manage Roles" : "Assign Role"}
          </button>
        );
      },
    },
  ];

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      )}

      {/* Status Banner */}
      {statusMessage && (
        <Alert
          message={statusMessage}
          type={statusType}
          showIcon
          closable
          onClose={() => setStatusMessage(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <Users size={26} /> User Role Management
        </h1>
        <div className="flex gap-2">
          {/* ✅ NEW Assign Role Button */}
          <button
            onClick={() => openAssignModal()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 shadow hover:bg-green-700"
          >
            <UserPlus size={18} /> Assign Role
          </button>

          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 shadow hover:bg-blue-700"
          >
            <RefreshCcw size={18} /> Refresh
          </button>
          <button
            onClick={goBack}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-md border p-4">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Assign Role Modal */}
      <Modal
        open={isModalOpen}
        onOk={handleSaveUserRoles}
        onCancel={() => setIsModalOpen(false)}
        title={
          selectedUser
            ? `Manage Roles — ${selectedUser.name}`
            : "Assign Roles to User"
        }
        okText="Save Changes"
      >
        {/* User Select (only visible when no user is preselected) */}
        {!selectedUser && (
          <Select
            showSearch
            style={{ width: "100%", marginBottom: 12 }}
            placeholder="Select user"
            onChange={(id) => setSelectedUserId(id)}
            value={selectedUserId || undefined}
          >
            {users.map((user: User) => (
              <Option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        )}

        {/* Roles Multi-Select */}
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={selectedRoleIds}
          onChange={setSelectedRoleIds}
          placeholder="Select roles to assign"
        >
          {roles.map((role: Role) => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default UserRoleManagement;
