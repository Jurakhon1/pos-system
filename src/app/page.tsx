"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/entities/auth/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Если пользователь аутентифицирован, перенаправляем на dashboard
    if (isAuthenticated()) {
      router.push("/dashboard");
    } else {
      // Если не аутентифицирован, перенаправляем на логин
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Показываем загрузку во время перенаправления
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Перенаправление...</p>
      </div>
    </div>
  );
}
