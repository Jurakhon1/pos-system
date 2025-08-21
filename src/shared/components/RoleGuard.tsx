"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/entities/auth/hooks/useAuth";
import { Loader2, Shield } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles = [],
  fallback,
  redirectTo
}) => {
  const { isAuthenticated, getCurrentUserRole, hasAccessToPage, redirectToDefaultPage } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      const userRole = getCurrentUserRole();
      if (!userRole) {
        router.push('/login');
        return;
      }

      // Если указаны конкретные роли, проверяем их
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(userRole);
        if (!hasRequiredRole) {
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            redirectToDefaultPage();
          }
          return;
        }
      }

      // Проверяем доступ к текущей странице
      const currentPath = window.location.pathname;
      if (!hasAccessToPage(currentPath)) {
        redirectToDefaultPage();
        return;
      }

      setHasAccess(true);
      setIsChecking(false);
    };

    // Небольшая задержка для корректной работы с localStorage
    const timer = setTimeout(checkAccess, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, getCurrentUserRole, hasAccessToPage, redirectToDefaultPage, requiredRoles, redirectTo, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Доступ запрещен</h1>
          <p className="text-muted-foreground mb-4">
            У вас нет прав для доступа к этой странице.
          </p>
          <button
            onClick={() => redirectToDefaultPage()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Перейти на главную
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Хук для проверки доступа к конкретной странице
export const usePageAccess = (pagePath: string) => {
  const { hasAccessToPage, getCurrentUserRole } = useAuth();
  
  return {
    hasAccess: hasAccessToPage(pagePath),
    userRole: getCurrentUserRole(),
    canAccess: hasAccessToPage(pagePath)
  };
};

// Компонент для условного отображения контента на основе роли
export const RoleBasedContent: React.FC<{
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
}> = ({ children, roles, fallback }) => {
  const { getCurrentUserRole } = useAuth();
  const userRole = getCurrentUserRole();

  if (!userRole || !roles.includes(userRole)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
