import React from "react";
import { Modal, Input } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: any;
  setFormData: any;
}

const SupplierFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
}) => {
  return (
    <Modal
      title={formData.supplierId ? "Edit Supplier" : "Add Supplier"}
      open={open}
      onOk={onSave}
      onCancel={onClose}
      okText="Save"
      cancelText="Cancel"
    >
      <Input
        placeholder="Supplier Name"
        value={formData.supplierName}
        onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Contact Person"
        value={formData.contactPerson}
        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="WhatsApp Number"
        value={formData.whatsApp}
        onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <Input.TextArea
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="GST Number"
        value={formData.gstNumber}
        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Payment Terms (eg: Net 30, Advance)"
        value={formData.paymentTerms}
        onChange={(e) =>
          setFormData({ ...formData, paymentTerms: e.target.value })
        }
        style={{ marginBottom: 10 }}
      />
      <Input.TextArea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        style={{ marginBottom: 10 }}
      />
    </Modal>
  );
};

export default SupplierFormModal;
