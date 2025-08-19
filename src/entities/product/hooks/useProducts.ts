import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/productsApi";
import { useAuth } from "@/entities/auth/hooks/useAuth";

export const useProducts = () => {
  const { getCurrentLocationId } = useAuth();
  const locationId = getCurrentLocationId();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", locationId],
    queryFn: () => productsApi.getProducts(locationId),
    enabled: !!locationId, // Запрос выполняется только если есть locationId
  });

  return {
    products,
    isLoading,
    error,
  };
};
