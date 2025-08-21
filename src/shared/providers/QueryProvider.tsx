"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // Создаем QueryClient только один раз при монтировании
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Оптимизация для сервера
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000,   // 10 минут (было cacheTime)
        retry: (failureCount, error: any) => {
          // Не повторяем запросы для 4xx ошибок
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  }));

  // Мемоизируем конфигурацию
  const queryClientConfig = useMemo(() => ({
    client: queryClient,
  }), [queryClient]);

  return (
    <QueryClientProvider {...queryClientConfig}>
      {children}
      {/* Devtools только в development - можно добавить позже */}
      {process.env.NODE_ENV === 'development' && false && (
        <div>Devtools disabled for now</div>
      )}
    </QueryClientProvider>
  );
}