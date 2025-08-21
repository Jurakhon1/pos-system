/**
 * Типы для меню и товаров
 */

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string;
  cost_price: string;
  cooking_time: number;
  calories: number;
  is_active: boolean;
  is_available: boolean;
  location_id: string;
  created_at: string;
  updated_at: string;
  category: MenuCategory;
  recipes: unknown[]; // Можно расширить позже для техкарт
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  location_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  is_available: boolean;
  image_url?: string;
  cooking_time: number;
  calories: number;
}

export interface MenuCategoryDto {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  display_order: number;
}

// Фильтры для меню
export interface MenuFilters {
  category_id?: string;
  search?: string;
  is_available?: boolean;
  price_min?: number;
  price_max?: number;
  cooking_time_max?: number;
}

// Ответ API для меню
export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  message?: string;
}

// Пагинация для меню
export interface MenuPaginationParams {
  page: number;
  limit: number;
  category_id?: string;
  search?: string;
  sort_by?: 'name' | 'price' | 'cooking_time' | 'calories';
  sort_order?: 'asc' | 'desc';
}
