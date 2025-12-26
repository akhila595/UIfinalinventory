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
import { fetchUsersWithRoles, fetchRoles } from "@/api/userRoleApi";

const { Option } = Select;

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roleNames: string[];
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
  const [selectedRoleNames, setSelectedRoleNames] = useState<string[]>([]);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] =
    useState<"success" | "error" | "warning" | "info">("info");

  /* =========================
     LOAD DATA
  ========================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetchUsersWithRoles(),
        fetchRoles(),
      ]);

      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setStatusMessage(null);
    } catch (err) {
      console.error(err);
      setStatusType("error");
      setStatusMessage("Failed to load users or roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     OPEN MODAL
  ========================= */
  const openAssignModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setSelectedUserId(user.id);
      setSelectedRoleNames(user.roleNames || []);
    } else {
      setSelectedUser(null);
      setSelectedUserId(null);
      setSelectedRoleNames([]);
    }
    setIsModalOpen(true);
  };

  /* =========================
     SAVE ROLES
  ========================= */
  const handleSaveUserRoles = async () => {
    const userId = selectedUser?.id || selectedUserId;
    if (!userId) {
      setStatusType("warning");
      setStatusMessage("Please select a user");
      return;
    }

    try {
      const roleIds = roles
        .filter((r) => selectedRoleNames.includes(r.name))
        .map((r) => r.id);

      await axios.post("/api/roles/assign", {
        userId,
        roleIds,
      });

      setStatusType("success");
      setStatusMessage("Roles updated successfully");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setStatusType("error");
      setStatusMessage("Failed to assign roles");
    }
  };

  /* =========================
     TABLE COLUMNS
  ========================= */
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Roles",
      render: (_: any, record: User) =>
        record.roleNames.length ? (
          <div className="flex flex-wrap gap-1">
            {record.roleNames.map((r) => (
              <Tag key={r} color="blue">
                {r}
              </Tag>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 italic">No roles</span>
        ),
    },
    {
      title: "Action",
      render: (_: any, record: User) => (
        <button
          onClick={() => openAssignModal(record)}
          className="flex items-center gap-1 px-3 py-1 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserCheck size={14} /> Manage Roles
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      )}

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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <Users size={26} /> User Role Management
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => openAssignModal()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <UserPlus size={18} /> Assign Role
          </button>

          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <RefreshCcw size={18} /> Refresh
          </button>

          <button
            onClick={goBack}
            className="bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border p-4">
        <Table columns={columns} dataSource={users} rowKey="id" />
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleSaveUserRoles}
        onCancel={() => setIsModalOpen(false)}
        title="Assign Roles"
        okText="Save"
      >
        {!selectedUser && (
          <Select
            style={{ width: "100%", marginBottom: 12 }}
            placeholder="Select User"
            onChange={setSelectedUserId}
          >
            {users.map((u) => (
              <Option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </Option>
            ))}
          </Select>
        )}

        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={selectedRoleNames}
          onChange={setSelectedRoleNames}
          placeholder="Select Roles"
        >
          {roles.map((r) => (
            <Option key={r.name} value={r.name}>
              {r.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default UserRoleManagement;
