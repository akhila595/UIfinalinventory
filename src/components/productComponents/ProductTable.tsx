import React from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ProductDTO } from "@/types/productTypes";

interface ProductTableProps {
  products: ProductDTO[];
  loading: boolean;
  onEdit: (product: ProductDTO) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url: string) =>
        url ? (
          <img src={url} alt="product" style={{ width: 60, height: 60, objectFit: "cover" }} />
        ) : (
          "-"
        ),
    },
    { title: "Name", dataIndex: "productName", key: "productName" },
    { title: "Design Code", dataIndex: "designCode", key: "designCode" },
    { title: "Pattern", dataIndex: "pattern", key: "pattern" },
    { title: "Category", dataIndex: "categoryName", key: "categoryName" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ProductDTO) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id!)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={products} loading={loading} />;
};

export default ProductTable;
