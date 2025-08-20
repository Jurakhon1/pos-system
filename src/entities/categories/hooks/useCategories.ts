<<<<<<< HEAD
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesApi, Category, CreateCategoryDto, UpdateCategoryDto } from "../api/categoriesApi";
import { toast } from "sonner";
=======
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api/categoriesApi";
import { useAuth } from "@/entities/auth/hooks/useAuth";
>>>>>>> 0c841d24fcc77d93f82c54b7dfabc06c592da811

export const useCategories = () => {
  const { getCurrentLocationId } = useAuth();
  const locationId = getCurrentLocationId();

<<<<<<< HEAD
  // Получить все категории
  const {
    data: categories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoriesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Создать категорию
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => CategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Категория успешно создана");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при создании категории: ${error.message}`);
    },
  });

  // Обновить категорию
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      CategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Категория успешно обновлена");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при обновлении категории: ${error.message}`);
    },
  });

  // Удалить категорию
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => CategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Категория успешно удалена");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при удалении категории: ${error.message}`);
    },
  });

  // Изменить статус активности
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      CategoriesApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Статус категории изменен");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при изменении статуса: ${error.message}`);
    },
=======
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories", locationId],
    queryFn: () => categoriesApi.getCategories(locationId),
    enabled: !!locationId, // Запрос выполняется только если есть locationId
>>>>>>> 0c841d24fcc77d93f82c54b7dfabc06c592da811
  });

  return {
    // Данные
    categories,
    isLoading,
    error,
<<<<<<< HEAD
    refetch,

    // Мутации
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    toggleActive: toggleActiveMutation.mutate,

    // Состояния загрузки
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
    isToggling: toggleActiveMutation.isPending,

    // Обработчики ошибок
    createError: createCategoryMutation.error,
    updateError: updateCategoryMutation.error,
    deleteError: deleteCategoryMutation.error,
    toggleError: toggleActiveMutation.error,
=======
>>>>>>> 0c841d24fcc77d93f82c54b7dfabc06c592da811
  };
};

// Хук для получения одной категории по ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => CategoriesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
