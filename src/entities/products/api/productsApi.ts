import { api } from "@/shared/api/axios";

export interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  purchase_price: string;
  category_id: string;
  supplier_id: string | null;
  barcode: string;
  sku: string;
  minimum_stock: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateProductDto {
  name: string;
  description: string;
  unit: string;
  purchase_price: string;
  category_id: string;
  supplier_id?: string | null;
  barcode: string;
  sku: string;
  minimum_stock: string;
  is_active: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const ProductsApi = {
  // Получить все продукты
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  // Получить продукт по ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Получить продукты по категории
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Создать новый продукт
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Обновить продукт
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Удалить продукт
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Изменить статус активности
  toggleActive: async (id: string, isActive: boolean): Promise<Product> => {
    const response = await api.patch(`/products/${id}/toggle-active`, { isActive });
    return response.data;
  },

  // Обновить запасы
  updateStock: async (id: string, minimumStock: string): Promise<Product> => {
    const response = await api.patch(`/products/${id}/stock`, { minimum_stock: minimumStock });
    return response.data;
  },

  // Обновить изображение
  updateImage: async (id: string, imageUrl: string): Promise<Product> => {
    const response = await api.patch(`/products/${id}/image`, { image_url: imageUrl });
    return response.data;
  },

  // Поиск по названию, описанию или SKU
  search: async (query: string): Promise<Product[]> => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Получить продукты с низким запасом
  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get('/products/low-stock');
    return response.data;
  },

  // Получить продукты без запасов
  getOutOfStock: async (): Promise<Product[]> => {
    const response = await api.get('/products/out-of-stock');
    return response.data;
  }
};