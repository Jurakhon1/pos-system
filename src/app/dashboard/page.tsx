"use client";

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
  FileText,
  DollarSign,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Имитация загрузки данных
    const loadData = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(loadData);
    };
  }, []);

  const stats = [
    {
      title: "Продажи сегодня",
      value: "₽ 45,230",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      textColor: "text-emerald-700 dark:text-emerald-300",
      changeColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Заказы в ожидании",
      value: "8",
      change: "-2",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      textColor: "text-orange-700 dark:text-orange-300",
      changeColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Активные пользователи",
      value: "12",
      change: "+3",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      textColor: "text-blue-700 dark:text-blue-300",
      changeColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Товары в наличии",
      value: "156",
      change: "+5",
      icon: Package,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      textColor: "text-purple-700 dark:text-purple-300",
      changeColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  const quickActions = [
    {
      title: "Новый заказ",
      description: "Создать заказ",
      icon: Plus,
      href: "/pos",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40"
    },
    {
      title: "Добавить товар",
      description: "В каталог",
      icon: Package,
      href: "/admin/products",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/40"
    },
    {
      title: "Отчеты",
      description: "Просмотр",
      icon: FileText,
      href: "/reports",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/40"
    },
    {
      title: "Настройки",
      description: "Система",
      icon: Settings,
      href: "/admin/settings",
      color: "from-gray-500 to-slate-600",
      bgColor: "bg-gray-50 hover:bg-gray-100 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
    }
  ];

  const recentActivities = [
    {
      type: "order",
      title: "Заказ #1234 создан",
      time: "2 минуты назад",
      amount: "₽ 1,250",
      status: "success",
      icon: ShoppingCart
    },
    {
      type: "product",
      title: "Товар 'Пицца Маргарита' добавлен",
      time: "15 минут назад",
      status: "info",
      icon: Package
    },
    {
      type: "user",
      title: "Пользователь 'admin' вошел в систему",
      time: "1 час назад",
      status: "warning",
      icon: Users
    },
    {
      type: "kitchen",
      title: "Заказ #1230 готов к выдаче",
      time: "1 час 15 минут назад",
      status: "success",
      icon: Package
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-emerald-500";
      case "info": return "bg-blue-500";
      case "warning": return "bg-orange-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Панель управления
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Добро пожаловать в POS систему
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="secondary" className="text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {currentTime.toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Badge>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Текущее время</p>
              <p className="text-2xl font-mono font-bold text-foreground">
                {currentTime.toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stat.changeColor}`}></div>
                  <p className={`text-sm font-medium ${stat.changeColor}`}>
                    {stat.change} с прошлой недели
                  </p>
                </div>
              </CardContent>
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`}></div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <Card className="h-full border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Быстрые действия
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`h-auto p-4 justify-start ${action.bgColor} border border-border hover:border-border/60 transition-all duration-200 group`}
                      onClick={() => window.location.href = action.href}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-foreground group-hover:text-foreground/80">
                            {action.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                        <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Charts */}
        <div className="xl:col-span-2 space-y-8">
          {/* Recent Activities */}
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Последние действия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors duration-200 group cursor-pointer"
                    >
                      <div className={`w-3 h-3 ${getStatusColor(activity.status)} rounded-full`}></div>
                      <div className={`p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors`}>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {activity.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                      {activity.amount && (
                        <Badge variant="secondary" className="font-mono">
                          {activity.amount}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart Placeholder */}
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Производительность
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl border-2 border-dashed border-border">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground font-medium">График производительности</p>
                  <p className="text-sm text-muted-foreground/70">Здесь будет отображаться статистика</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-8">
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">₽ 156,789</div>
                <div className="text-blue-100">Общая выручка за месяц</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1,234</div>
                <div className="text-blue-100">Заказов за месяц</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98.5%</div>
                <div className="text-blue-100">Удовлетворенность клиентов</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
