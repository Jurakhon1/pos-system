import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/authApi";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const isAuthenticated = () => {
    // Проверяем токен в localStorage
    const token = localStorage.getItem("token");
    
    // Также проверяем в cookies
    const cookieToken = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];
    
    return !!(token || cookieToken);
  };

  const getCurrentUserId = () => {
    return localStorage.getItem("userId");
  };



  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Сохраняем токен в localStorage
      localStorage.setItem("token", data.accessToken);
      
      // Также сохраняем в cookies для middleware
      document.cookie = `token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 дней
      
      // Сохраняем ID пользователя из JWT токена
      try {
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        if (payload.sub) {
          localStorage.setItem("userId", payload.sub.toString());
        }
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
      }
      
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Перенаправляем на dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Здесь можно добавить уведомление пользователю об ошибке
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      // После успешной регистрации перенаправляем на страницу входа
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/login");
    },
    onError: () => {
      console.error("Registration failed");
    },
  });

  const logout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem("token");
    
    // Удаляем ID пользователя из localStorage
    localStorage.removeItem("userId");
    
    // Удаляем токен из cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Очищаем кеш
    queryClient.clear();
    
    // Перенаправляем на страницу входа
    router.push("/login");
  };

  return {
    login: (username: string, password: string) => loginMutation.mutate({ username, password }),
    register: registerMutation.mutate,
    logout,
    isAuthenticated,
    getCurrentUserId,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
};
