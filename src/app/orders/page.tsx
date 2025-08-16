"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { Orders, ORDER_STATUSES } from "@/shared/types/orders";
import { formatDate } from "@/shared/lib/utils";

export default function OrdersPage() {
  const { orders, isLoading, error } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "status" | "total">("date");

  // Фильтрация заказов
  const filteredOrders = orders?.filter((order: Orders) => {
    const matchesSearch = order.items.some(item => 
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.cashier.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery)
    );
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Сортировка заказов
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "status":
        return a.status.localeCompare(b.status);
      case "total":
        const totalA = a.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const totalB = b.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        return totalB - totalA;
      default:
        return 0;
    }
  });

  // Вычисление общей суммы заказа
  const calculateOrderTotal = (order: Orders) => {
    return order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  };

  // Получение статуса заказа
  const getOrderStatus = (status: string) => {
    return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Ошибка загрузки заказов: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-600 mt-2">
            Управление заказами и их статусами
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/pos'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый заказ
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по товарам, кассиру или ID заказа..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "status" | "total")}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">По дате</option>
                <option value="status">По статусу</option>
                <option value="total">По сумме</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Заказы не найдены</p>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </CardContent>
          </Card>
        ) : (
          sortedOrders.map((order) => {
            const status = getOrderStatus(order.status);
            const total = calculateOrderTotal(order);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Заказ #</span>
                        <span className="font-bold text-lg">{order.id}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Просмотр
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Изменить
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Кассир: {order.cashier.username}</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        Итого: ₽{total.toFixed(2)}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-3">Товары:</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                {item.product.imageUrl ? (
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-sm text-gray-500">
                                  ₽{Number(item.price).toFixed(2)} × {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ₽{(Number(item.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary */}
      {sortedOrders.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Показано заказов: {sortedOrders.length}</span>
              <span>
                Общая сумма: ₽{sortedOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
