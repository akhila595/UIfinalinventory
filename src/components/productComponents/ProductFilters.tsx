import React from "react";
import { Input, Select } from "antd";

const { Option } = Select;

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onCategoryChange,
}) => {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
      <Input
        placeholder="Search by product name or design code"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: "300px" }}
      />

      <Select
        placeholder="Filter by Category"
        style={{ width: 200 }}
        allowClear
        onChange={onCategoryChange}
      >
        <Option value="Mens">Mens</Option>
        <Option value="Womens">Womens</Option>
        <Option value="Kids">Kids</Option>
      </Select>
    </div>
  );
};

export default ProductFilters;
