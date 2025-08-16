import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsApi } from "../api/productsApi";
import { Products } from "@/shared/types/products";

export const useProducts = () => {
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: ProductsApi.getProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: (productData: Products) => ProductsApi.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ productId, productData }: { productId: number; productData: Products }) =>
      ProductsApi.updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products,
    isLoading,
    error,
    refetch,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
  };
};

export const useProduct = (productId: number) => {
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductsApi.getProductById(productId),
    enabled: !!productId,
  });

  const updateProductMutation = useMutation({
    mutationFn: (productData: Products) => ProductsApi.updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    product,
    isLoading,
    error,
    refetch,
    updateProduct: updateProductMutation.mutate,
    isUpdating: updateProductMutation.isPending,
  };
};
