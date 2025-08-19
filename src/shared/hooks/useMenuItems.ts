import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/api/axios';
import type { MenuItem, MenuCategory, MenuFilters, MenuPaginationParams } from '@/shared/types/menu';

interface UseMenuItemsReturn {
  // Данные
  menuItems: MenuItem[];
  categories: MenuCategory[];
  
  // Состояние загрузки
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  // Фильтры и пагинация
  filters: MenuFilters;
  pagination: MenuPaginationParams;
  
  // Действия
  setFilters: (filters: Partial<MenuFilters>) => void;
  setPagination: (pagination: Partial<MenuPaginationParams>) => void;
  refreshData: () => void;
  
  // Утилиты
  getItemsByCategory: (categoryId: string) => MenuItem[];
  getAvailableItems: () => MenuItem[];
  searchItems: (query: string) => MenuItem[];
}

export function useMenuItems(
  locationId?: string,
  initialFilters?: Partial<MenuFilters>
): UseMenuItemsReturn {
  // Состояние данных
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Фильтры и пагинация
  const [filters, setFiltersState] = useState<MenuFilters>({
    is_available: true,
    ...initialFilters
  });
  
  const [pagination, setPaginationState] = useState<MenuPaginationParams>({
    page: 1,
    limit: 50,
    sort_by: 'display_order',
    sort_order: 'asc'
  });

  // Загрузка данных
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Загружаем категории
      const categoriesResponse = await api.get('/menu/categories', {
        params: { location_id: locationId, is_active: true }
      });
      
      const categoriesData = categoriesResponse.data.data || categoriesResponse.data;
      setCategories(categoriesData);

      // Загружаем товары меню
      const menuResponse = await api.get('/menu/items', {
        params: {
          location_id: locationId,
          is_active: true,
          is_available: true,
          ...filters,
          ...pagination
        }
      });

      const menuData = menuResponse.data.data || menuResponse.data;
      setMenuItems(menuData);

    } catch (err: any) {
      setIsError(true);
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки данных');
      console.error('Ошибка загрузки меню:', err);
    } finally {
      setIsLoading(false);
    }
  }, [locationId, filters, pagination]);

  // Обновление фильтров
  const setFilters = useCallback((newFilters: Partial<MenuFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPaginationState(prev => ({ ...prev, page: 1 })); // Сбрасываем страницу при изменении фильтров
  }, []);

  // Обновление пагинации
  const setPagination = useCallback((newPagination: Partial<MenuPaginationParams>) => {
    setPaginationState(prev => ({ ...prev, ...newPagination }));
  }, []);

  // Обновление данных
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Утилиты для работы с данными
  const getItemsByCategory = useCallback((categoryId: string): MenuItem[] => {
    return menuItems.filter(item => item.category_id === categoryId);
  }, [menuItems]);

  const getAvailableItems = useCallback((): MenuItem[] => {
    return menuItems.filter(item => item.is_available && item.is_active);
  }, [menuItems]);

  const searchItems = useCallback((query: string): MenuItem[] => {
    if (!query.trim()) return menuItems;
    
    const lowerQuery = query.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
      item.category.name.toLowerCase().includes(lowerQuery)
    );
  }, [menuItems]);

  // Загружаем данные при изменении зависимостей
  useEffect(() => {
    if (locationId) {
      loadData();
    }
  }, [loadData, locationId]);

  return {
    // Данные
    menuItems,
    categories,
    
    // Состояние загрузки
    isLoading,
    isError,
    error,
    
    // Фильтры и пагинация
    filters,
    pagination,
    
    // Действия
    setFilters,
    setPagination,
    refreshData,
    
    // Утилиты
    getItemsByCategory,
    getAvailableItems,
    searchItems
  };
}
