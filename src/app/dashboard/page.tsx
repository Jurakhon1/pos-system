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
  Clock} from "lucide-react";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
            <p className="text-gray-600 mt-2">
              Добро пожаловать в POS систему
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Сегодня</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} с прошлой недели
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
                <button 
                  onClick={() => router.push('/pos')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer"
                >
                  <div className="font-medium text-gray-900">Новый заказ</div>
                  <div className="text-sm text-gray-500">Создать заказ</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-900">Добавить товар</div>
                  <div className="text-sm text-gray-500">В каталог</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="text-sm text-gray-500">Просмотр</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-900">Настройки</div>
                  <div className="text-sm text-gray-500">Система</div>
                </button>
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
                    <div className="text-sm font-medium text-gray-900">Товар &quot;Пицца Маргарита&quot; добавлен</div>
                    <div className="text-xs text-gray-500">15 минут назад</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Пользователь &quot;admin&quot; вошел в систему</div>
                    <div className="text-xs text-gray-500">1 час назад</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
