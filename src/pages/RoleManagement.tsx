import React, { useEffect, useState } from "react";
import { Table, Modal, Input, Select, Tag, Spin, Alert } from "antd";
import {
  Pencil,
  Trash2,
  PlusCircle,
  RefreshCcw,
  ArrowLeft,
  Shield,
} from "lucide-react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getRolePermissions,
  assignPermissionsToRole,
} from "@/api/SuperadminApi";

const { Option } = Select;

interface Permission {
  id: number;
  code: string;
  name: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  permissionIds: number[];
}

interface Props {
  goBack: () => void;
}

const RoleManagement: React.FC<Props> = ({ goBack }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Role fields
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newPermissionIds, setNewPermissionIds] = useState<number[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editPermissionIds, setEditPermissionIds] = useState<number[]>([]);

  // For banner alerts
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | "info" | "warning">(
    "info"
  );

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([getRoles(), getPermissions()]);
      const rolesWithPerms = await Promise.all(
        rolesData.map(async (r: Role) => {
          const assigned = await getRolePermissions(r.id);
          return { ...r, permissionIds: assigned.map((p: any) => p.id) };
        })
      );
      setRoles(rolesWithPerms || []);
      setPermissions(permsData || []);
      setStatusMessage(null); // clear any prior alerts
    } catch (err) {
      console.error("Error loading roles:", err);
      setStatusType("error");
      setStatusMessage("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==============================
  // ADD ROLE
  // ==============================
  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      setStatusType("warning");
      setStatusMessage("Role name is required.");
      return;
    }

    try {
      const role = await createRole({
        name: newRoleName,
        description: newRoleDesc,
        permissionIds: newPermissionIds,
      });

      if (newPermissionIds.length > 0) {
        await assignPermissionsToRole(role.id, newPermissionIds);
      }

      setStatusType("success");
      setStatusMessage(`Role "${newRoleName}" created successfully.`);
      setIsAddModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error adding role:", err);
      setStatusType("error");
      setStatusMessage("Failed to create role. Please check your input and try again.");
    }
  };

  // ==============================
  // EDIT ROLE
  // ==============================
  const handleEditRole = async (role: Role) => {
    try {
      const assigned = await getRolePermissions(role.id);
      setSelectedRole(role);
      setEditPermissionIds(assigned.map((p: any) => p.id));
      setIsEditModalOpen(true);
    } catch {
      setStatusType("error");
      setStatusMessage("Failed to load role permissions.");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedRole) return;
    try {
      await updateRole(String(selectedRole.id), selectedRole);
      await assignPermissionsToRole(selectedRole.id, editPermissionIds);
      setStatusType("success");
      setStatusMessage(`Role "${selectedRole.name}" updated successfully.`);
      setIsEditModalOpen(false);
      fetchData();
    } catch {
      setStatusType("error");
      setStatusMessage("Failed to update role. Please try again.");
    }
  };

  // ==============================
  // DELETE ROLE (Safe Delete with 409 handling)
  // ==============================
  const handleDeleteRole = async (id: number, name?: string) => {
    if (!window.confirm(`Are you sure you want to delete the role "${name}"?`)) return;

    try {
      await deleteRole(String(id));
      setStatusType("success");
      setStatusMessage(`Role "${name}" deleted successfully.`);
      fetchData();
    } catch (err: any) {
      console.error("Delete role failed:", err);

      if (err.response?.status === 409) {
        setStatusType("error");
        setStatusMessage(
          `⚠️ Cannot delete the role "${name}" because it is assigned to one or more users. Please unassign it before deleting.`
        );
      } else if (err.response?.status === 404) {
        setStatusType("warning");
        setStatusMessage("Role not found. It may have already been deleted.");
      } else {
        setStatusType("error");
        setStatusMessage("An unexpected error occurred while deleting the role.");
      }
    }
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns = [
    { title: "Role Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Permissions",
      key: "permissions",
      render: (_: any, record: Role) =>
        record.permissionIds?.length ? (
          <div className="flex flex-wrap gap-1">
            {record.permissionIds.map((id) => {
              const perm = permissions.find((p) => p.id === id);
              return (
                <Tag key={id} color="purple">
                  {perm ? perm.code : `#${id}`}
                </Tag>
              );
            })}
          </div>
        ) : (
          <span className="text-gray-400 italic">No permissions</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Role) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditRole(record)}
            className="px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => handleDeleteRole(record.id, record.name)}
            className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      )}

      {/* ✅ Persistent Status Banner */}
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
          <Shield size={26} /> Role Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <PlusCircle size={18} /> Add Role
          </button>
          <button
            onClick={fetchData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
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

      {/* Roles Table */}
      <div className="bg-white rounded-xl shadow-md border p-4">
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Add Role Modal */}
      <Modal
        open={isAddModalOpen}
        onOk={handleAddRole}
        onCancel={() => setIsAddModalOpen(false)}
        title="Add New Role"
        okText="Create Role"
      >
        <Input
          placeholder="Role Name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Description"
          value={newRoleDesc}
          onChange={(e) => setNewRoleDesc(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={newPermissionIds}
          onChange={setNewPermissionIds}
          placeholder="Select permissions"
        >
          {permissions.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.code} — {p.name}
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
        title={`Edit Role — ${selectedRole?.name}`}
        okText="Save Changes"
      >
        <Input
          placeholder="Role Name"
          value={selectedRole?.name || ""}
          onChange={(e) =>
            setSelectedRole((prev) => (prev ? { ...prev, name: e.target.value } : prev))
          }
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Description"
          value={selectedRole?.description || ""}
          onChange={(e) =>
            setSelectedRole((prev) =>
              prev ? { ...prev, description: e.target.value } : prev
            )
          }
          style={{ marginBottom: 10 }}
        />
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={editPermissionIds}
          onChange={setEditPermissionIds}
          placeholder="Select permissions"
        >
          {permissions.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.code} — {p.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default RoleManagement;
