import api from "@/shared/api/axios";
import { Category } from "@/shared/types/categories";

export const categoriesApi = {
  getCategories: async (locationId?: string) => {
    // Получаем категории меню
    const params = new URLSearchParams();
    if (locationId) {
      params.append('location_id', locationId);
    }
    
    const response = await api.get(`/menu/categories?${params.toString()}`);
    return response.data;
  },
    getCategoryById: async (categoryId: string) => {
        const response = await api.get(`/menu/categories/${categoryId}`);
        return response.data;
    },
    createCategory: async (categoryData: Category) => {
        const response = await api.post(`/categories`, categoryData);
        return response.data;
    },
    updateCategory: async (categoryId: string, categoryData: Partial<Category>) => {
        const response = await api.put(`/categories/${categoryId}`, categoryData);
        return response.data;   
    },
    deleteCategory: async (categoryId: string) => {
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data;
    }
};
