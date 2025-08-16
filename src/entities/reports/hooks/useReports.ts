import { useQuery } from "@tanstack/react-query";
import { ReportsApi } from "../api/reportsApi";

export const useReports = () => {
  const {
    data: reports,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: ReportsApi.getReports,
  });

  return {
    reports,
    isLoading,
    error,
    refetch,
  };
};

export const useDailySales = () => {
  const {
    data: dailySales,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["daily-sales"],
    queryFn: ReportsApi.getDailySales,
  });

  return {
    dailySales,
    isLoading,
    error,
    refetch,
  };
};
