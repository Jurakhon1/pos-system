import api from "@/shared/api/axios";
import { RegisterUser } from "@/shared/types/auth";

export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    console.log('🔐 Sending login request to:', '/auth/login');
    const response = await api.post(`/auth/login`, credentials);
    console.log('📡 Login response:', response.data);
    return response.data;
  },
  register: async (userData: RegisterUser) => {
    console.log('🔐 Sending register request to:', '/auth/register');
    const response = await api.post(`/auth/register`, userData);
    console.log('📡 Register response:', response.data);
    return response.data;
  },
};
