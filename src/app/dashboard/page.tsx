"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users, 
  Clock,
  Plus,
  Settings,
  FileText
} from "lucide-react";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";
import { PageLayout, QuickActionButton } from "@/shared/components/PageLayout";

export default function DashboardPage() {
  const router = useRouter();
  
  const stats = [
    {
      title: "Продажи",
      value: "₽ 45,230",
      change: "+12.5%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Заказы в ожидании",
      value: "8",
      change: "-2",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Активные пользователи",
      value: "12",
      change: "+3",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Товары в наличии",
      value: "156",
      change: "+5",
      icon: Package,
      color: "text-purple-600"
    }
  ];

  return (
    <RoleGuard requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
      <PageLayout
        title="Панель управления"
        subtitle="Добро пожаловать в POS систему"
        icon={<BarChart3 className="w-8 h-8" />}
        stats={stats}
      >
        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Быстрые действия
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                  icon={<ShoppingCart className="w-5 h-5" />}
                  title="Новый заказ"
                  subtitle="Создать заказ"
                  onClick={() => router.push('/pos')}
                />
                <QuickActionButton
                  icon={<Plus className="w-5 h-5" />}
                  title="Добавить товар"
                  subtitle="В каталог"
                  onClick={() => router.push('/admin/products')}
                />
                <QuickActionButton
                  icon={<FileText className="w-5 h-5" />}
                  title="Отчеты"
                  subtitle="Просмотр"
                  onClick={() => router.push('/reports')}
                />
                <QuickActionButton
                  icon={<Settings className="w-5 h-5" />}
                  title="Настройки"
                  subtitle="Система"
                  onClick={() => router.push('/settings')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Последние действия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Заказ #1234 создан</div>
                    <div className="text-xs text-gray-500">2 минуты назад</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">₽ 1,250</div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Товар "Пицца Маргарита" добавлен</div>
                    <div className="text-xs text-gray-500">15 минут назад</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Пользователь "admin" вошел в систему</div>
                    <div className="text-xs text-gray-500">1 час назад</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </RoleGuard>
  );
}
