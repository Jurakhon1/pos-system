"use client"

import { useState } from "react";
import { Order } from "@/shared/types/orders";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { 
  Loader2, 
  Package, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Users
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { useAuth } from "@/entities/auth/hooks/useAuth";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

// Вспомогательные функции для работы со статусами
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-yellow-800';
    case 'cooking':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    case 'ready':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800';
    case 'served':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    case 'paid':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'confirmed':
      return <CheckCircle className="w-4 h-4" />;
    case 'cooking':
      return <Clock className="w-4 h-4" />;
    case 'ready':
      return <CheckCircle className="w-4 h-4" />;
    case 'served':
      return <CheckCircle className="w-4 h-4" />;
    case 'paid':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Ожидает';
    case 'confirmed':
      return 'Подтвержден';
    case 'cooking':
      return 'Готовится';
    case 'ready':
      return 'Готов';
    case 'served':
      return 'Подано';
    case 'paid':
      return 'Оплачено';
    case 'cancelled':
      return 'Отменено';
    default:
      return 'Неизвестно';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    case 'normal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'low':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800';
  }
};

export default function KitchenPage() {
  const { getCurrentUserId } = useAuth();
  const { orders, isLoading, error, startCookingOrderItem, markOrderItemReady } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"time" | "priority">("time");

  // Фильтрация заказов
  const filteredOrders = orders?.filter((order: Order) => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.table?.number.toString().includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Сортировка заказов
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "time") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      // Приоритет: urgent > high > normal > low
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      return bPriority - aPriority;
    }
  });

  // Группировка заказов по приоритету
  const urgentOrders = sortedOrders.filter(order => order.priority === 'urgent');
  const highOrders = sortedOrders.filter(order => order.priority === 'high');
  const normalOrders = sortedOrders.filter(order => order.priority === 'normal');
  const lowOrders = sortedOrders.filter(order => order.priority === 'low');

  const handleStartCooking = async (orderId: string, itemId: string) => {
    try {
      const cookId = getCurrentUserId();
      if (cookId) {
        startCookingOrderItem({ orderId, itemId, cookId });
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
    }
  };

  const handleMarkReady = async (orderId: string, itemId: string) => {
    try {
      markOrderItemReady({ orderId, itemId });
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600">Ошибка загрузки</h2>
          <p className="text-gray-600">{error.message || 'Произошла ошибка при загрузке заказов'}</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard requiredRoles={[USER_ROLES.CHEF, USER_ROLES.COOK, USER_ROLES.ADMIN]}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Кухня</h1>
            <p className="text-muted-foreground">Управление заказами и приготовлением блюд</p>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground">
              {orders?.length || 0} заказов
            </span>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Поиск по номеру заказа, клиенту или столу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидает</option>
            <option value="confirmed">Подтвержден</option>
            <option value="cooking">Готовится</option>
            <option value="ready">Готов</option>
            <option value="served">Подано</option>
            <option value="paid">Оплачено</option>
            <option value="cancelled">Отменено</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "time" | "priority")}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="time">По времени</option>
            <option value="priority">По приоритету</option>
          </select>
        </div>

        {/* Срочные заказы */}
        {urgentOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              СРОЧНЫЕ ЗАКАЗЫ ({urgentOrders.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {urgentOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  priority="urgent"
                  onStartCooking={handleStartCooking}
                  onMarkReady={handleMarkReady}
                />
              ))}
            </div>
          </div>
        )}

        {/* Высокий приоритет */}
        {highOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-orange-600 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              ВЫСОКИЙ ПРИОРИТЕТ ({highOrders.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  priority="high"
                  onStartCooking={handleStartCooking}
                  onMarkReady={handleMarkReady}
                />
              ))}
            </div>
          </div>
        )}

        {/* Обычные заказы */}
        {normalOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
              <Package className="w-5 h-5" />
              ОБЫЧНЫЕ ЗАКАЗЫ ({normalOrders.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {normalOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  priority="normal"
                  onStartCooking={handleStartCooking}
                  onMarkReady={handleMarkReady}
                />
              ))}
            </div>
          </div>
        )}

        {/* Низкий приоритет */}
        {lowOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              НИЗКИЙ ПРИОРИТЕТ ({lowOrders.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lowOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  priority="low"
                  onStartCooking={handleStartCooking}
                  onMarkReady={handleMarkReady}
                />
              ))}
            </div>
          </div>
        )}

        {/* Сообщение об отсутствии заказов */}
        {sortedOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Нет заказов для отображения
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedStatus !== "all" 
                ? "Попробуйте изменить фильтры поиска" 
                : "Все заказы обработаны"}
            </p>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

// Компонент карточки заказа
function OrderCard({ 
  order, 
  priority, 
  onStartCooking, 
  onMarkReady 
}: { 
  order: Order; 
  priority: string;
  onStartCooking: (orderId: string, itemId: string) => void;
  onMarkReady: (orderId: string, itemId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);





  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          {/* Заголовок заказа */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">#</span>
              <span className="font-bold text-lg text-foreground">{order.order_number}</span>
            </div>
            <Badge className={getPriorityColor(priority)}>
              {priority === 'urgent' ? 'СРОЧНО' : priority === 'high' ? 'ВЫСОКИЙ' : 'ОБЫЧНЫЙ'}
            </Badge>
          </div>
          
          {/* Статус заказа */}
          <div className="flex w-full">
            <Badge className={`${getStatusColor(order.status)} w-full flex items-center justify-center px-3 py-1 text-sm font-medium`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{getStatusText(order.status)}</span>
            </Badge>
          </div>

          {/* Тип заказа */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {order.order_type === 'dine_in' ? '🍽️ В ресторане' : '🚀 На вынос'}
            </Badge>
            {order.table && (
              <Badge variant="outline" className="text-xs">
                Стол {order.table.number}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Основная информация */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate text-xs">
              {new Date(order.created_at).toLocaleString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {order.customer_name && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span className="truncate text-xs">{order.customer_name}</span>
            </div>
          )}
          
          {order.guest_count && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span className="truncate text-xs">{order.guest_count} гостей</span>
            </div>
          )}
          
          <div className="text-sm font-bold text-green-600 dark:text-green-400">
            ₽{Number(order.total_amount).toFixed(2)}
          </div>
        </div>

        {/* Кнопка развертывания */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? 'Скрыть детали' : 'Показать детали'}
        </Button>

        {/* Детали заказа */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t">
            <h4 className="font-semibold text-sm">Позиции заказа:</h4>
            <div className="space-y-2">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <div className="flex-1">
                                         <div className="font-medium text-sm">{item.menuItem?.name || 'Неизвестный товар'}</div>
                     <div className="text-xs text-muted-foreground">
                       Количество: {item.quantity}
                     </div>
                     {item.special_instructions && (
                       <div className="text-xs text-muted-foreground">
                         Примечания: {item.special_instructions}
                       </div>
                     )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                    {item.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => onStartCooking(order.id, item.id)}
                        className="h-8 px-2 text-xs"
                      >
                        Начать готовить
                      </Button>
                    )}
                    {item.status === 'cooking' && (
                      <Button
                        size="sm"
                        onClick={() => onMarkReady(order.id, item.id)}
                        className="h-8 px-2 text-xs bg-green-600 hover:bg-green-700"
                      >
                        Готово
                      </Button>
                    )}
                    {item.status === 'ready' && (
                      <span className="text-sm text-green-600 dark:text-green-400">✓ Готово</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
