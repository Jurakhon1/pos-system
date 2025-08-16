import api from "@/shared/api/axios";
import { RegisterUser } from "@/shared/types/auth";

export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post(`/auth/login`, credentials);
    return response.data;
  },
  register: async (userData: RegisterUser) => {
    const response = await api.post(`/auth/register`, userData);
    return response.data;
  },
};
