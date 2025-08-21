"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

export default function ReportsPage() {
  const reportTypes = [
    {
      title: "Отчет по продажам",
      description: "Анализ продаж по периодам, категориям и продуктам",
      icon: TrendingUp,
      color: "text-green-600",
      href: "/reports/sales"
    },
    {
      title: "Отчет по заказам",
      description: "Статистика заказов, их статусов и времени выполнения",
      icon: Package,
      color: "text-blue-600",
      href: "/reports/orders"
    },
    {
      title: "Отчет по клиентам",
      description: "Анализ клиентской базы и их предпочтений",
      icon: Users,
      color: "text-purple-600",
      href: "/reports/customers"
    },
    {
      title: "Финансовый отчет",
      description: "Доходы, расходы и прибыльность",
      icon: DollarSign,
      color: "text-orange-600",
      href: "/reports/financial"
    }
  ];

  const quickStats = [
    {
      title: "Продажи сегодня",
      value: "₽ 45,230",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Заказов сегодня",
      value: "24",
      change: "+8.3%",
      trend: "up",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Новых клиентов",
      value: "7",
      change: "-2.1%",
      trend: "down",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Средний чек",
      value: "₽ 1,885",
      change: "+5.7%",
      trend: "up",
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  const recentReports = [
    {
      name: "Отчет по продажам за март 2024",
      type: "Продажи",
      date: "01.04.2024",
      size: "2.4 MB"
    },
    {
      name: "Анализ клиентской базы Q1 2024",
      type: "Клиенты",
      date: "31.03.2024",
      size: "1.8 MB"
    },
    {
      name: "Финансовый отчет февраль 2024",
      type: "Финансы",
      date: "01.03.2024",
      size: "3.1 MB"
    },
    {
      name: "Отчет по заказам январь 2024",
      type: "Заказы",
      date: "01.02.2024",
      size: "2.7 MB"
    }
  ];

  return (
    <RoleGuard requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Отчеты и аналитика</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Анализ данных и генерация отчетов
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Быстрая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
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
                  <p className={`text-xs flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Типы отчетов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Основные отчеты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportTypes.slice(0, 2).map((report, index) => {
                const Icon = report.icon;
                return (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${report.color}`} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{report.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{report.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Дополнительные отчеты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportTypes.slice(2).map((report, index) => {
                const Icon = report.icon;
                return (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${report.color}`} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{report.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{report.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Недавние отчеты */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Недавние отчеты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{report.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{report.type} • {report.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{report.size}</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Графики и диаграммы */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Продажи по дням недели</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">График продаж</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Популярные категории</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Круговая диаграмма</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
