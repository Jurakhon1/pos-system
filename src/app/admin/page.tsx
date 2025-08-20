"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { 
  Settings, 
  XCircle, 
  CheckCircle, 
  Package, 
  Users, 
  ShoppingCart,
  BarChart3,
  Database,
  Shield
} from "lucide-react";
import Link from "next/link";

const adminSections = [
  {
    title: "Категории",
    description: "Управление категориями блюд",
    icon: XCircle,
    href: "/admin/categories",
    color: "bg-blue-500",
    count: 0
  },
  {
    title: "Меню",
    description: "Управление пунктами меню",
    icon: CheckCircle,
    href: "/admin/menu",
    color: "bg-green-500",
    count: 0
  },
  {
    title: "Продукты",
    description: "Управление продуктами и ингредиентами",
    icon: Package,
    href: "/admin/products",
    color: "bg-purple-500",
    count: 0
  },
  {
    title: "Кухня",
    description: "Управление кухонными станциями",
    icon: Package,
    href: "/admin/kitchen",
    color: "bg-orange-500",
    count: 0
  },
  {
    title: "Пользователи",
    description: "Управление пользователями системы",
    icon: Users,
    href: "/admin/users",
    color: "bg-orange-500",
    count: 0
  },
  {
    title: "Заказы",
    description: "Просмотр и управление заказами",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "bg-red-500",
    count: 0
  },
  {
    title: "Отчеты",
    description: "Аналитика и отчеты",
    icon: BarChart3,
    href: "/admin/reports",
    color: "bg-indigo-500",
    count: 0
  },
  {
    title: "Настройки",
    description: "Системные настройки",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-gray-500",
    count: 0
  }
];

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
          <p className="text-gray-600 mt-2">
            Управление системой ресторана
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <span className="text-sm text-gray-600">Администратор</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <XCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Категории</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Пункты меню</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Продукты</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Заказов сегодня</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Кухонных станций</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${section.color} group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {section.description}
                      </p>
                      {section.count > 0 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {section.count} элементов
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Последняя активность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Новая категория "Десерты" добавлена</span>
              <span className="text-xs text-gray-400 ml-auto">2 мин назад</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Обновлено меню "Основные блюда"</span>
              <span className="text-xs text-gray-400 ml-auto">15 мин назад</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Новый продукт "Сыр моцарелла" добавлен</span>
              <span className="text-xs text-gray-400 ml-auto">1 час назад</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Новая кухонная станция "Горячий цех" создана</span>
              <span className="text-xs text-gray-400 ml-auto">2 часа назад</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
