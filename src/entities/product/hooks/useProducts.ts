import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/productsApi";

export const useProducts = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getProducts,
  });

  return {
    products,
    isLoading,
    error,
  };
};
