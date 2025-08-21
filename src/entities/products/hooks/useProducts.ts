import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsApi, CreateProductDto, UpdateProductDto } from "../api/productsApi";
import { toast } from "sonner";

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Получить все продукты
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["products"],
    queryFn: ProductsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Создать продукт
  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductDto) => ProductsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Продукт успешно создан");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании продукта: ${error.message}`);
    },
  });

  // Обновить продукт
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      ProductsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Продукт успешно обновлен");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении продукта: ${error.message}`);
    },
  });

  // Удалить продукт
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => ProductsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Продукт успешно удален");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении продукта: ${error.message}`);
    },
  });

  // Изменить статус активности
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      ProductsApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Статус продукта изменен");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при изменении статуса: ${error.message}`);
    },
  });

  // Обновить запасы
  const updateStockMutation = useMutation({
    mutationFn: ({ id, stockQuantity }: { id: string; stockQuantity: number }) =>
      ProductsApi.updateStock(id, stockQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Запасы обновлены");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении запасов: ${error.message}`);
    },
  });

  // Обновить изображение
  const updateImageMutation = useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string }) =>
      ProductsApi.updateImage(id, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Изображение обновлено");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении изображения: ${error.message}`);
    },
  });

  return {
    // Данные
    products,
    isLoading,
    error,
    refetch,

    // Мутации
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    toggleActive: toggleActiveMutation.mutate,
    updateStock: updateStockMutation.mutate,
    updateImage: updateImageMutation.mutate,

    // Состояния загрузки
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isToggling: toggleActiveMutation.isPending,
    isUpdatingStock: updateStockMutation.isPending,
    isUpdatingImage: updateImageMutation.isPending,

    // Обработчики ошибок
    createError: createProductMutation.error,
    updateError: updateProductMutation.error,
    deleteError: deleteProductMutation.error,
    toggleError: toggleActiveMutation.error,
    stockError: updateStockMutation.error,
    imageError: updateImageMutation.error,
  };
};

// Хук для получения одного продукта по ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => ProductsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для получения продуктов по категории
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => ProductsApi.getByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для поиска по продуктам
export const useProductsSearch = (query: string) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => ProductsApi.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 минуты для поиска
  });
};

// Хук для получения продуктов с низким запасом
export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: ProductsApi.getLowStock,
    staleTime: 2 * 60 * 1000, // 2 минуты для запасов
  });
};

// Хук для получения продуктов без запасов
export const useOutOfStockProducts = () => {
  return useQuery({
    queryKey: ["products", "out-of-stock"],
    queryFn: ProductsApi.getOutOfStock,
    staleTime: 2 * 60 * 1000, // 2 минуты для запасов
  });
};
