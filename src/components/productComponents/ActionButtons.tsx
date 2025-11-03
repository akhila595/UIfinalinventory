import React from "react";
import { Button } from "antd";
import { PlusOutlined, ReloadOutlined, DownloadOutlined } from "@ant-design/icons";

interface ActionButtonsProps {
  onAdd: () => void;
  onRefresh: () => void;
  onExport: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAdd, onRefresh, onExport }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        Add Product
      </Button>
      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        Refresh
      </Button>
      <Button icon={<DownloadOutlined />} onClick={onExport}>
        Export CSV
      </Button>
    </div>
  );
};

export default ActionButtons;
