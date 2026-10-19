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

export interface OptionItem {
  id: string;
  name: string;
  price: number;
  maxQuantity?: number;
}

export interface OptionGroup {
  id: string;
  title: string;
  type: "single" | "multiple_with_quantity";
  options: OptionItem[];
}

export interface SelectedOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  branch: {
    id: string;
    name: string;
  };
  selectedOptions: SelectedOption[];
  unitPrice: number;
  totalPrice: number;
}

