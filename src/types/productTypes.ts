export interface ProductDTO {
  id?: number; // Product ID (optional for create)
  productName: string;
  designCode: string;
  pattern?: string;
  imageUrl?: string;

  // Related entities
  brandId?: number;
  brandName?: string;

  clothTypeId?: number;
  clothTypeName?: string;

  categoryId?: number;
  categoryName?: string;

  // Additional fields (optional for future)
  stockCount?: number;
  price?: number;
  supplierName?: string;
}
