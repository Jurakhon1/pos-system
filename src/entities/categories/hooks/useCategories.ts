import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api/categoriesApi";
import { useAuth } from "@/entities/auth/hooks/useAuth";

export const useCategories = () => {
  const { getCurrentLocationId } = useAuth();
  const locationId = getCurrentLocationId();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories", locationId],
    queryFn: () => categoriesApi.getCategories(locationId),
    enabled: !!locationId, // Запрос выполняется только если есть locationId
  });

  return {
    categories,
    isLoading,
    error,
  };
};

export const useCategory = (categoryId: string) => {
  const queryClient = useQueryClient();

  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoriesApi.getCategoryById(categoryId),
    enabled: !!categoryId,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (categoryData: Partial<Category>) => categoriesApi.updateCategory(categoryId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: () => categoriesApi.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    category,
    isLoading,
    error,
    refetch,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};
