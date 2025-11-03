import React, { useEffect, useState } from "react";
import { getAllProducts  } from "@/api/productApi"; // Import the API function

interface Product {
  id: number;
  productName: string;
  designCode: string;
  pattern: string;
  brandName: string | null;
  clothTypeName: string | null;
  categoryName: string;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts() // Use the imported API function
      .then((res) => {
        setProducts(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading Products Table...</p>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">📦 Products Table</h2>
      <table className="w-full table-auto border-collapse text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Product Name</th>
            <th className="border px-2 py-1">Design Code</th>
            <th className="border px-2 py-1">Pattern</th>
            <th className="border px-2 py-1">Brand</th>
            <th className="border px-2 py-1">Cloth Type</th>
            <th className="border px-2 py-1">Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.id}</td>
              <td className="border px-2 py-1">{item.productName}</td>
              <td className="border px-2 py-1">{item.designCode}</td>
              <td className="border px-2 py-1">{item.pattern}</td>
              <td className="border px-2 py-1">{item.brandName || "-"}</td>
              <td className="border px-2 py-1">{item.clothTypeName || "-"}</td>
              <td className="border px-2 py-1">{item.categoryName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
