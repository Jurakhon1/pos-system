import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/authApi";
import { USER_ROLES, ROLE_ACCESS, ROLE_DEFAULT_PAGE, UserRole } from "@/shared/types/auth";
import { localStorageUtils } from "@/shared/hooks/useLocalStorage";
import { useState, useEffect, useCallback, useMemo } from "react";

interface LoginCredentials {
  username: string;
  password: string;
}

interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  config?: any;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  // Состояние для отслеживания клиентской инициализации
  const [isClient, setIsClient] = useState(false);

  // Инициализация клиентского состояния
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthenticated = useCallback(() => {
    // Проверяем, что мы на клиенте
    if (!isClient) return false;
    
    // Проверяем токен в localStorage
    const token = localStorageUtils.getItem("token");
    
    // Также проверяем в cookies для middleware
    let cookieToken: string | undefined;
    if (typeof window !== 'undefined') {
      cookieToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];
    }
    
    return !!(token || cookieToken);
  }, [isClient]);

  const getCurrentUserId = useCallback(() => {
    if (!isClient) return null;
    return localStorageUtils.getItem("userId");
  }, [isClient]);

  const getCurrentLocationId = useCallback(() => {
    if (!isClient) return null;
    return localStorageUtils.getItem("locationId");
  }, [isClient]);

  const getCurrentUserRole = useCallback((): UserRole | null => {
    if (!isClient) return null;
    const role = localStorageUtils.getItem("role");
    if (role && Object.values(USER_ROLES).includes(role as UserRole)) {
      return role as UserRole;
    }
    return null;
  }, [isClient]);

  const hasAccessToPage = useCallback((pagePath: string): boolean => {
    const role = getCurrentUserRole();
    if (!role) return false;
    
    const allowedPages = ROLE_ACCESS[role];
    return allowedPages.includes(pagePath as never);
  }, [getCurrentUserRole]);

  const getDefaultPageForRole = useCallback((): string => {
    const role = getCurrentUserRole();
    if (!role) return '/login';
    
    return ROLE_DEFAULT_PAGE[role];
  }, [getCurrentUserRole]);

  const redirectToDefaultPage = useCallback(() => {
    const defaultPage = getDefaultPageForRole();
    router.push(defaultPage);
  }, [getDefaultPageForRole, router]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Сохраняем токен в localStorage (только на клиенте)
      if (isClient) {
        localStorageUtils.setItem("token", data.accessToken);
        
        // Также сохраняем в cookies для middleware
        if (typeof window !== 'undefined') {
          document.cookie = `token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 дней
        }
        
        // Сохраняем ID пользователя и location_id из JWT токена
        try {
          const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
          
          if (payload.sub) {
            localStorageUtils.setItem("userId", payload.sub.toString());
          }
          
          if (payload.location_id) {
            localStorageUtils.setItem("locationId", payload.location_id.toString());
          }
          
          // Сохраняем дополнительные данные пользователя
          if (data.user) {
            localStorageUtils.setItem("role", data.user.role || '');
            localStorageUtils.setItem("username", data.user.username || '');
            localStorageUtils.setItem("email", data.user.email || '');
            localStorageUtils.setItem("firstName", data.user.first_name || '');
            localStorageUtils.setItem("lastName", data.user.last_name || '');
          }
          
          localStorageUtils.setItem("refreshToken", data.refreshToken || '');
          
        } catch (error) {
          console.error("Failed to decode JWT token:", error);
        }
      }
      
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Перенаправляем на страницу по умолчанию для роли
      const defaultPage = getDefaultPageForRole();
      router.push(defaultPage);
    },
    onError: (error: ApiError) => {
      // Уведомление пользователю об ошибке
      if (isClient && typeof window !== 'undefined') {
        alert(`Ошибка входа: ${error.response?.data?.message || error.message || 'Неизвестная ошибка'}`);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      // После успешной регистрации перенаправляем на страницу входа
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/login");
    },
    onError: (error: ApiError) => {
      if (isClient && typeof window !== 'undefined') {
        alert(`Ошибка регистрации: ${error.response?.data?.message || error.message || 'Неизвестная ошибка'}`);
      }
    },
  });

  const logout = useCallback(() => {
    if (isClient) {
      // Удаляем токен из localStorage
      localStorageUtils.removeItem("token");
      localStorageUtils.removeItem("userId");
      localStorageUtils.removeItem("locationId");
      localStorageUtils.removeItem("role");
      localStorageUtils.removeItem("username");
      localStorageUtils.removeItem("email");
      localStorageUtils.removeItem("firstName");
      localStorageUtils.removeItem("lastName");
      localStorageUtils.removeItem("refreshToken");
      
      // Удаляем токен из cookies
      if (typeof window !== 'undefined') {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
    
    // Очищаем кеш
    queryClient.clear();
    
    // Перенаправляем на страницу входа
    router.push("/login");
  }, [isClient, queryClient, router]);

  // Мемоизируем возвращаемые значения
  const authValues = useMemo(() => ({
    login: (username: string, password: string) => {
      if (!isClient) return;
      loginMutation.mutate({ username, password });
    },
    register: registerMutation.mutate,
    logout,
    isAuthenticated,
    getCurrentUserId,
    getCurrentLocationId,
    getCurrentUserRole,
    hasAccessToPage,
    getDefaultPageForRole,
    redirectToDefaultPage,
    isLoading: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isClient, // Добавляем флаг для проверки клиентского состояния
  }), [
    isClient,
    loginMutation,
    registerMutation,
    logout,
    isAuthenticated,
    getCurrentUserId,
    getCurrentLocationId,
    getCurrentUserRole,
    hasAccessToPage,
    getDefaultPageForRole,
    redirectToDefaultPage,
  ]);

  return authValues;
};
