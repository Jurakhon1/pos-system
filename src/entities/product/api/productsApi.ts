import api from "@/shared/api/axios";
import { Products } from "@/shared/types/products";
import { MenuItem } from "@/shared/types/menu";

export const productsApi = {
  getProducts: async (locationId?: string): Promise<Products[]> => {
    // Получаем позиции меню вместо продуктов
    const params = new URLSearchParams();
    if (locationId) {
      params.append('location_id', locationId);
    }
    
    const response = await api.get(`/menu/items?${params.toString()}`);
    // Преобразуем данные в формат Products
    return response.data.map((item: MenuItem) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: {
        id: item.category_id,
        name: item.category?.name || 'Без категории'
      },
      imageUrl: item.image_url,
      menuItemId: item.id // ID позиции меню для заказов
    }));
  },

  getProduct: async (id: number): Promise<Products> => {
    const response = await api.get(`/menu/items/${id}`);
    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: {
        id: item.category_id,
        name: item.category?.name || 'Без категории'
      },
      imageUrl: item.image_url,
      menuItemId: item.id
    };
  },

  createProduct: async (product: Partial<Products>): Promise<Products> => {
    const response = await api.post("/products", product);
    return response.data;
  },

  updateProduct: async (id: number, product: Partial<Products>): Promise<Products> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
