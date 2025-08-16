import api from "@/shared/api/axios";
import { User } from "@/shared/types/auth";

export const userApi = {
    getUsers: async () => {
        const response = await api.get(`/users`);
        return response.data;
    },
    getUserById: async (userId: string) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },
    createUser: async (userData: User) => {
        const response = await api.post(`/users`, userData);
        return response.data;
    },
    updateUser: async (userId: string, userData: Partial<User>) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },
    deleteUser: async (userId: string) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },
};