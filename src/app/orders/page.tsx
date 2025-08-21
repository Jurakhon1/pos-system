"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Printer,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Table as TableIcon
} from "lucide-react";
import { OrdersApi } from "@/entities/orders/api/ordersApi";
import { Order, OrderItem } from "@/shared/types/orders";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");
  const defaultLocationId = '2';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pending, cooking, ready, completed, cancelled] = await Promise.all([
        OrdersApi.getPendingOrders(defaultLocationId),
        OrdersApi.getCookingOrders(defaultLocationId),
        OrdersApi.getReadyOrders(defaultLocationId),
        OrdersApi.getCompletedOrders?.(defaultLocationId) || Promise.resolve([]),
        OrdersApi.getCancelledOrders?.(defaultLocationId) || Promise.resolve([])
      ]);
      const allOrders = [...pending, ...cooking, ...ready, ...completed, ...cancelled];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (err) {
      setError('Ошибка загрузки заказов');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone?.includes(searchTerm)
      );
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Фильтр по дате
    if (dateFilter !== "all") {
      const today = new Date();
      const orderDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(order => {
            orderDate.setTime(order.created_at ? new Date(order.created_at).getTime() : 0);
            return orderDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            orderDate.setTime(order.created_at ? new Date(order.created_at).getTime() : 0);
            return orderDate >= weekAgo;
          });
          break;
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            orderDate.setTime(order.created_at ? new Date(order.created_at).getTime() : 0);
            return orderDate >= monthAgo;
          });
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cooking: 'bg-orange-100 text-orange-800 border-orange-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      pending: 'Ожидает',
      cooking: 'Готовится',
      ready: 'Готово',
      completed: 'Завершен',
      cancelled: 'Отменен'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      pending: <Clock className="w-4 h-4" />,
      cooking: <Clock className="w-4 h-4" />,
      ready: <CheckCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const handleViewOrder = (order: Order) => {
    // Здесь можно добавить модальное окно или переход к детальному просмотру заказа
    console.log('Просмотр заказа:', order);
  };

  const handlePrintOrder = (order: Order) => {
    // Здесь можно добавить логику печати заказа
    console.log('Печать заказа:', order);
  };

  const calculateTotal = (order: Order) => {
    return order.orderItems?.reduce((total, item) => 
      total + (item.price || 0) * (item.quantity || 1), 0
    ) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard requiredRoles={[USER_ROLES.CASHIER, USER_ROLES.WAITER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
      <div className="min-h-screen bg-background text-foreground p-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 mb-6 rounded border border-red-200 dark:border-red-800">
            {error}
            <Button variant="outline" size="sm" onClick={fetchOrders} className="ml-2">
              Повторить
            </Button>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Управление заказами
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Просмотр и управление всеми заказами
            </p>
          </div>

          {/* Фильтры и поиск */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Поиск */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск по номеру заказа, клиенту..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Фильтр по статусу */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидает</option>
                <option value="cooking">Готовится</option>
                <option value="ready">Готово</option>
                <option value="completed">Завершен</option>
                <option value="cancelled">Отменен</option>
              </select>

              {/* Фильтр по дате */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Все даты</option>
                <option value="today">Сегодня</option>
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
              </select>

              {/* Кнопка обновления */}
              <Button onClick={fetchOrders} className="w-full">
                Обновить
              </Button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {['pending', 'cooking', 'ready', 'completed', 'cancelled'].map((status) => {
              const count = orders.filter(order => order.status === status).length;
              return (
                <Card key={status} className="text-center">
                  <CardContent className="p-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{getStatusText(status)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Список заказов */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Заказы не найдены
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Попробуйте изменить фильтры или создать новый заказ
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <CardTitle className="text-lg">
                            Заказ #{order.order_number || order.id.slice(-6)}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {order.customer_name || 'Не указано'}
                            </span>
                            {order.customer_phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {order.customer_phone}
                              </span>
                            )}
                            {order.table_number && (
                              <span className="flex items-center gap-1">
                                <TableIcon className="w-4 h-4" />
                                Стол {order.table_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </Badge>
                        <span className="text-lg font-bold text-blue-600">
                          {calculateTotal(order)} ₽
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.orderItems?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {item.menuItem?.name || 'Неизвестно'}
                            </h4>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              x{item.quantity} • {item.price} ₽
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {(item.price || 0) * (item.quantity || 1)} ₽
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {order.notes && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                          <strong>Примечания:</strong> {order.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Просмотр
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintOrder(order)}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Печать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
