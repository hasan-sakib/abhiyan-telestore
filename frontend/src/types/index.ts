export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  status: "in_stock" | "out_of_stock" | "upcoming";
  is_featured: boolean;
  brand?: string;
  model?: string;
  specs?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  category_id?: number;
  category?: Category;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: number;
  products?: Product[];
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface CartItem {
  id?: number;
  product_id: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  user_id?: number;
  session_id?: string;
  items: CartItem[];
}

export interface Order {
  id: number;
  user_id: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_address: Record<string, string>;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface AdminStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
}
