import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/authApi";
import { USER_ROLES, ROLE_ACCESS, ROLE_DEFAULT_PAGE, UserRole } from "@/shared/types/auth";

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

  const getCurrentLocationId = () => {
    const locationId = localStorage.getItem("locationId");
    console.log('🔍 getCurrentLocationId called, result:', locationId);
    return locationId;
  };

  const getCurrentUserRole = (): UserRole | null => {
    const role = localStorage.getItem("role");
    if (role && Object.values(USER_ROLES).includes(role as UserRole)) {
      return role as UserRole;
    }
    return null;
  };

  const hasAccessToPage = (pagePath: string): boolean => {
    const role = getCurrentUserRole();
    if (!role) return false;
    
    const allowedPages = ROLE_ACCESS[role];
    return allowedPages.includes(pagePath as any);
  };

  const getDefaultPageForRole = (): string => {
    const role = getCurrentUserRole();
    if (!role) return '/login';
    
    return ROLE_DEFAULT_PAGE[role];
  };

  const redirectToDefaultPage = () => {
    const defaultPage = getDefaultPageForRole();
    router.push(defaultPage);
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Сохраняем токен в localStorage
      localStorage.setItem("token", data.accessToken);
      
      // Также сохраняем в cookies для middleware
      document.cookie = `token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 дней
      
      // Сохраняем ID пользователя и location_id из JWT токена
      try {
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        console.log('JWT payload:', payload);
        
        if (payload.sub) {
          localStorage.setItem("userId", payload.sub.toString());
        }
        
        if (payload.location_id) {
          localStorage.setItem("locationId", payload.location_id.toString());
        }
        
        // Сохраняем дополнительные данные пользователя
        if (data.user) {
          localStorage.setItem("role", data.user.role || '');
          localStorage.setItem("username", data.user.username || '');
          localStorage.setItem("email", data.user.email || '');
          localStorage.setItem("firstName", data.user.first_name || '');
          localStorage.setItem("lastName", data.user.last_name || '');
        }
        
        localStorage.setItem("refreshToken", data.refreshToken || '');
        
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
      }
      
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Перенаправляем на страницу по умолчанию для роли
      const defaultPage = getDefaultPageForRole();
      router.push(defaultPage);
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
    localStorage.removeItem("locationId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("refreshToken");
    
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
    getCurrentLocationId,
    getCurrentUserRole,
    hasAccessToPage,
    getDefaultPageForRole,
    redirectToDefaultPage,
    isLoading: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
