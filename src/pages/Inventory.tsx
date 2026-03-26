import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllProducts } from "@/api/productApi";
import { PlusCircle, Search, Package } from "lucide-react";
import ProductForm from "@/components/forms/ProductForm";

interface ProductDTO {
  id?: number;
  name: string;
  code: string;
  imageUrl?: string;
  brandName?: string;
  categoryName?: string;
}

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data);
      setFilteredProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <motion.div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-indigo-600" />
          Inventory Management
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <PlusCircle size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border rounded-lg px-4 py-2 mb-6 shadow-sm w-full md:w-1/2">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 outline-none px-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Category</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p, i) => (
                <tr key={p.id} className="border-b hover:bg-indigo-50">
                  <td className="p-3">{i + 1}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          p.imageUrl
                            ? `${import.meta.env.VITE_API_BASE_URL}${p.imageUrl}`
                            : "/placeholder.png"
                        }
                        className="w-12 h-12 rounded object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500">{p.code}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">{p.brandName || "-"}</td>
                  <td className="p-3">{p.categoryName || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-6 text-3xl"
            >
              &times;
            </button>

            <ProductForm
              open={open}
              onClose={() => setOpen(false)}
              onSuccess={() => {
                setOpen(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InventoryPage;