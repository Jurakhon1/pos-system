import axios from "axios";
import { localStorageUtils } from "@/shared/hooks/useLocalStorage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://176.124.218.9:3040/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Проверяем, что мы на клиенте перед обращением к localStorage
  const token = localStorageUtils.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
export default api;
