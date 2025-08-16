import api from "@/shared/api/axios";
import { DailySales } from "@/shared/types/reports";

export const ReportsApi={
  getReports: async () => {
    const response = await api.get(`/reports`);
    return response.data;
  },
  getDailySales: async () => {
    const response = await api.get(`/reports/daily-sales`);
    return response.data as DailySales[];
  }
}