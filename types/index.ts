export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  display_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promotion_price?: number | null;
  image_url?: string;
  category_id: string;
  is_available: boolean;
  is_promotion: boolean;
};
