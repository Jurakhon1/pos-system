import { api } from "@/shared/api/axios";

<<<<<<< HEAD
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const CategoriesApi = {
  // Получить все категории
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Получить категорию по ID
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Создать новую категорию
  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Обновить категорию
  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Удалить категорию
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Изменить статус активности категории
  toggleActive: async (id: string, isActive: boolean): Promise<Category> => {
    const response = await api.patch(`/categories/${id}/toggle-active`, { isActive });
    return response.data;
  }
=======
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
>>>>>>> 0c841d24fcc77d93f82c54b7dfabc06c592da811
};
