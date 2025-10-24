export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  weight: number;
  image: string | null;
}
export interface ProductImageStructure {
  thumbnail: string;
  gallery: string[];
}
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  unit_id: string;
  description: string;
  images: {
    thumbnail?: string; // Cho phép thumbnail là optional khi nhận từ API
    gallery?: string[]; // Cho phép gallery là optional khi nhận từ API
  };
  price: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  short_description: string;
  specifications: any;
  compare_price: string | null;
  cost_price: string;
  weight: string;
  dimensions: any;
  min_stock: number;
  track_inventory: boolean;
  is_fresh: boolean;
  shelf_life_days: number;
  storage_conditions: string;
  origin: string;
  harvest_season: string;
  organic_certified: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  created_by: string;
  deleted_at: string | null;
  
  // Joined data from API
  category_name: string;
  unit_name: string;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  is_active: boolean;
  description: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  name: string;
  short_name?: string;
  is_active: boolean;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  category_id: number;
  unit_id: number;
  price: number;
  stock_quantity: number;
  short_description: string;
  description: string;
  origin: string;
  is_active: boolean;
  is_featured: boolean;
  images?: ProductImageStructure;  // Array of URLs
  specifications?: any;
  compare_price?: number;
  cost_price?: number;
  weight?: string;
  is_fresh?: boolean;
  shelf_life_days?: number;
  storage_conditions?: string;
  harvest_season?: string;
  organic_certified?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  category_id?: number;
  unit_id?: number;
  price?: number;
  stock_quantity?: number;
  short_description?: string;
  description?: string;
  origin?: string;
  is_active?: boolean;
  is_featured?: boolean;
  images?: ProductImageStructure;
  specifications?: any;
  compare_price?: number;
  cost_price?: number;
  weight?: string;
  is_fresh?: boolean;
  shelf_life_days?: number;
  storage_conditions?: string;
  harvest_season?: string;
  organic_certified?: boolean;
}

