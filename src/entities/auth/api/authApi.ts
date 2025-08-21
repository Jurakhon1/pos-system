import api from "@/shared/api/axios";
import { RegisterUser } from "@/shared/types/auth";

export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    console.log('🔐 Sending login request to:', '/api/auth/login');
    const response = await api.post(`/api/auth/login`, credentials);
    console.log('📡 Login response:', response.data);
    return response.data;
  },
  register: async (userData: RegisterUser) => {
    const response = await api.post(`/api/auth/register`, userData);
    return response.data;
  },
};
