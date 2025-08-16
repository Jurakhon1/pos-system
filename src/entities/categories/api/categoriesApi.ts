import api from "@/shared/api/axios";
import { Category } from "@/shared/types/categories";

export const categoriesApi = {
  getCategories: async () => {
    const response = await api.get(`/categories`);
    return response.data;
  },
    getCategoryById: async (categoryId: string) => {
        const response = await api.get(`/categories/${categoryId}`);
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
