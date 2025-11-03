import React, { useEffect, useState } from "react";
import { getCategories } from "@/api/masterDataApi"; // ✅ use helper instead of raw axios
import { toast } from "react-hot-toast";

interface Category {
  categoryId: number;
  categoryName: string;
}

export default function CategoryReport() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // ✅ use the helper function
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-md text-center">
        <p className="text-gray-500">Loading Category Report...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        🏷️ <span className="ml-2">Category Report</span>
      </h2>

      {categories.length > 0 ? (
        <ul className="list-disc pl-6 space-y-2">
          {categories.map((cat) => (
            <li key={cat.categoryId} className="text-gray-700">
              {cat.categoryName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm text-center mt-2">
          No categories found.
        </p>
      )}
    </div>
  );
}
