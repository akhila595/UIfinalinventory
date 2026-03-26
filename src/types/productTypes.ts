export interface ProductDTO {
   id?: number;

  name: string;
  code: string;
  imageUrl?: string;

  brandId?: number;
  brandName?: string;

  categoryId?: number;
  categoryName?: string;
}
