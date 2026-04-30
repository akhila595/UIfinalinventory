import { getAllProducts } from "../api/api";
import {
  createProduct,
  getBrands,
  getCategories,
  getAttributes,
  uploadProductImage,
} from "../api/api";


export const getTotalProducts = async () => {
  try {
    const res = await getAllProducts();

    // ✅ res is already array
    return Array.isArray(res) ? res.length : 0;
  } catch (error) {
    console.error("Error fetching total products", error);
    return 0;
  }
};

export const fetchProductMeta = async () => {
  try {
    const [brands, categories, attributes] = await Promise.all([
      getBrands(),
      getCategories(),
      getAttributes(),
    ]);

    return {
      brands: brands || [],
      categories: categories || [],
      attributes: attributes || [],
    };
  } catch (e) {
    console.error("Meta fetch error", e);
    return { brands: [], categories: [], attributes: [] };
  }
};

export const saveProduct = async (data: any) => {
  try {
    return await createProduct(data);
  } catch (e) {
    console.error("Save product error", e);
    throw e;
  }
};

export const uploadImage = async (file: any) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: "image.jpg",
    type: "image/jpeg",
  } as any);

  return await uploadProductImage(formData);
};