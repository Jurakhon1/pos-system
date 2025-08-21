"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { 
  Users, 
  Settings, 
  Server, 
  Shield, 
  BarChart3,
  FileText,
  Package,
  Building
} from "lucide-react";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";
import Link from "next/link";

export default function AdminPage() {
  const adminFeatures = [
    {
      title: "Управление пользователями",
      description: "Создание, редактирование и удаление пользователей системы",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-600"
    },
    {
      title: "Управление меню",
      description: "Добавление, редактирование и удаление блюд и категорий",
      icon: Package,
      href: "/admin/menu",
      color: "text-green-600"
    },
    {
      title: "Управление столами",
      description: "Настройка столов и их расположения",
      icon: Building,
      href: "/admin/tables",
      color: "text-purple-600"
    },
    {
      title: "Системные настройки",
      description: "Конфигурация системы и параметров",
      icon: Settings,
      href: "/admin/settings",
      color: "text-orange-600"
    },
    {
      title: "База данных",
      description: "Управление базой данных и резервными копиями",
      icon: Server,
      href: "/admin/database",
      color: "text-red-600"
    },
    {
      title: "Логи и аудит",
      description: "Просмотр логов системы и действий пользователей",
      icon: FileText,
      href: "/admin/logs",
      color: "text-gray-600"
    }
  ];

  const systemStats = [
    {
      title: "Всего пользователей",
      value: "24",
      change: "+3",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Активных заказов",
      value: "12",
      change: "+2",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Блюд в меню",
      value: "156",
      change: "+8",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Доход за месяц",
      value: "₽ 245,680",
      change: "+15.2%",
      icon: BarChart3,
      color: "text-orange-600"
    }
  ];

  return (
    <RoleGuard requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Админ панель</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Управление системой и настройками
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">Администратор</span>
          </div>
        </div>

        {/* Статистика системы */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} с прошлого месяца
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Основные функции админ панели */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Управление системой
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {adminFeatures.slice(0, 3).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Link key={index} href={feature.href}>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-6 h-6 ${feature.color}`} />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{feature.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Дополнительные функции
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {adminFeatures.slice(3).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Link key={index} href={feature.href}>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-6 h-6 ${feature.color}`} />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{feature.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              Быстрые действия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                <Users className="w-6 h-6" />
                <span>Добавить пользователя</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                <Package className="w-6 h-6" />
                <span>Добавить блюдо</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                <Server className="w-6 h-6" />
                <span>Резервная копия</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
