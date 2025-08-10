import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Проверяем токен в localStorage при загрузке
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Здесь будет проверка токена на сервере
      setAuthState({
        user: {
          id: "1",
          email: "admin@example.com",
          name: "Администратор",
          role: "admin",
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Здесь будет API вызов для аутентификации
      if (email === "admin@example.com" && password === "password") {
        const user = {
          id: "1",
          email,
          name: "Администратор",
          role: "admin",
        };
        
        // Сохраняем токен (в реальном приложении это будет JWT)
        localStorage.setItem("auth_token", "demo_token");
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
