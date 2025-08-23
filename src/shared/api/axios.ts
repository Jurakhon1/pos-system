import axios from "axios";
import { localStorageUtils } from "@/shared/hooks/useLocalStorage";

// Helper function to force decimal representation
const forceDecimal = (value: number): number => {
  // Принудительно создаем decimal представление
  const decimalString = value.toFixed(2);
  // Преобразуем обратно в число, но сохраняем decimal
  const result = parseFloat(decimalString);
  
  // Проверяем, что результат действительно имеет decimal
  if (result === Math.floor(result)) {
    // Если число целое, принудительно добавляем .00
    // Используем специальный трюк для сохранения decimal
    return parseFloat(result.toFixed(2));
  }
  return result;
};

// Helper function to ensure decimal formatting for monetary values
const ensureDecimalFormat = (data: any): any => {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'number') {
    // Force decimal representation for numbers
    return forceDecimal(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => ensureDecimalFormat(item));
  }
  
  if (typeof data === 'object') {
    const formatted: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if this field should be formatted as decimal (monetary fields)
      if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price') || key.toLowerCase().includes('total')) {
        if (typeof value === 'number') {
          // Принудительно создаем decimal представление
          formatted[key] = Number(value.toFixed(2));
        } else {
          formatted[key] = value;
        }
      } else {
        formatted[key] = ensureDecimalFormat(value);
      }
    }
    return formatted;
  }
  
  return data;
};

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
  
  // Ensure decimal formatting for monetary values in request data
  if (config.data) {
    console.log('🔍 API Interceptor - Original data:', config.data);
    const formattedData = ensureDecimalFormat(config.data);
    console.log('🔍 API Interceptor - Formatted data:', formattedData);
    config.data = formattedData;
  }
  
  return config;
});

// Добавляем response interceptor для логирования ответов
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };
export default api;
