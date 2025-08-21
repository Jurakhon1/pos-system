"use client"

import { useState, useEffect } from "react";
import { Order, OrderItem } from "@/shared/types/orders";
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

// Вспомогательные функции для работы со статусами
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800';
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
  const {
    orders,
    isLoading: loading,
    error,
    refetch,
    startCookingOrderItem,
    markOrderItemReady,
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Отладка: показываем все заказы для проверки данных
  console.log('Kitchen orders:', orders);
  
  // Фильтруем заказы для кухни - показываем все активные заказы
  const filteredOrders = (orders || []).filter((order: Order) => {
    // Показываем заказы, которые не завершены полностью
    const isNotCompleted = !['paid', 'cancelled'].includes(order.status);
    
    // Проверяем, есть ли позиции, которые нужно готовить
    const hasItemsToProcess = order.orderItems && order.orderItems.length > 0;
    
    console.log(`Order ${order.order_number}: status=${order.status}, hasItems=${hasItemsToProcess}, isNotCompleted=${isNotCompleted}`);
    
    return isNotCompleted && hasItemsToProcess;
  });

  // Фильтрация по поиску и статусу
  const finalFilteredOrders = filteredOrders.filter((order: Order) => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table?.number?.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Отладка финальных заказов
  console.log('Final filtered orders:', finalFilteredOrders);
  
  // Группировка заказов по статусу
  const urgentOrders = finalFilteredOrders.filter((order: Order) => 
          order.orderItems?.some((item: OrderItem) => item.status === 'pending')
  );
  const cookingOrders = finalFilteredOrders.filter((order: Order) => 
          order.orderItems?.some((item: OrderItem) => item.status === 'cooking')
  );
  const confirmedOrders = finalFilteredOrders.filter((order: Order) => 
          order.status === 'confirmed' || order.orderItems?.some((item: OrderItem) => item.status === 'pending')
  );
  
  console.log('Urgent orders:', urgentOrders.length);
  console.log('Cooking orders:', cookingOrders.length);
  console.log('Confirmed orders:', confirmedOrders.length);

  const handleStartCookingItem = (orderId: string, itemId: string) => {
    const cookId = getCurrentUserId();
    if (cookId) {
      startCookingOrderItem({ orderId, itemId, cookId });
    }
  };

  const handleMarkItemReady = (orderId: string, itemId: string) => {
    markOrderItemReady({ orderId, itemId });
  };

  // Автообновление каждые 30 секунд
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Статистика
  const totalPendingItems = finalFilteredOrders.reduce((sum: number, order: Order) => 
          sum + (order.orderItems?.filter((item: OrderItem) => item.status === 'pending').length || 0), 0
  );
  const totalCookingItems = finalFilteredOrders.reduce((sum: number, order: Order) => 
          sum + (order.orderItems?.filter((item: OrderItem) => item.status === 'cooking').length || 0), 0
  );
  const totalReadyItems = finalFilteredOrders.reduce((sum: number, order: Order) => 
          sum + (order.orderItems?.filter((item: OrderItem) => item.status === 'ready').length || 0), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
          <p className="text-muted-foreground">Загрузка кухни...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
                             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                 <Package className="h-8 w-8" />
               </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">Кухня</h1>
                <p className="text-orange-100 text-lg">Управление заказами и приготовлением</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                                                                   <Clock className="w-4 h-4 mr-2" />
                Обновить
              </Button>
              
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-white text-orange-600 hover:bg-white/90" : "bg-white/20 border-white/30 text-white hover:bg-white/30"}
              >
                                 <Clock className="w-4 h-4 mr-2" />
                {autoRefresh ? "Авто" : "Ручное"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="text-red-700 dark:text-red-300 font-medium">Ошибка загрузки заказов</p>
                  <p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Повторить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

                {/* Statistics Cards - Only show when there are orders */}
        {finalFilteredOrders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {totalPendingItems > 0 && (
              <Card className="border-border bg-card/80 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-yellow-100 dark:bg-yellow-950/20 rounded-lg">
                      <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ожидают</p>
                      <p className="text-lg font-bold text-foreground">{totalPendingItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {totalCookingItems > 0 && (
              <Card className="border-border bg-card/80 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Готовятся</p>
                      <p className="text-lg font-bold text-foreground">{totalCookingItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {totalReadyItems > 0 && (
              <Card className="border-border bg-card/80 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Готовы</p>
                      <p className="text-lg font-bold text-foreground">{totalReadyItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Всего</p>
                    <p className="text-lg font-bold text-foreground">{finalFilteredOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Minimalistic Search - Only show when there are orders */}
        {finalFilteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Simple Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск заказов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-background text-foreground min-w-[120px]"
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидают</option>
              <option value="confirmed">Подтверждены</option>
              <option value="cooking">Готовятся</option>
            </select>
          </div>
        )}

        {/* Priority Sections */}
        {urgentOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-bold text-foreground">Срочные заказы</h2>
              <Badge variant="destructive" className="ml-2">{urgentOrders.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentOrders.map((order: Order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  priority="urgent"
                  onStartCooking={handleStartCookingItem}
                  onMarkReady={handleMarkItemReady}
                />
              ))}
            </div>
          </div>
        )}

        {cookingOrders.length > 0 && (
          <div className="space-y-4">
                         <div className="flex items-center gap-2">
               <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
               <h2 className="text-xl font-bold text-foreground">Готовятся</h2>
               <Badge variant="secondary" className="ml-2">{cookingOrders.length}</Badge>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cookingOrders.map((order: Order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  priority="high"
                  onStartCooking={handleStartCookingItem}
                  onMarkReady={handleMarkItemReady}
                />
              ))}
            </div>
          </div>
        )}

        {confirmedOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-foreground">Подтверждены</h2>
              <Badge variant="outline" className="ml-2">{confirmedOrders.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {confirmedOrders.map((order: Order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  priority="normal"
                  onStartCooking={handleStartCookingItem}
                  onMarkReady={handleMarkItemReady}
                />
              ))}
            </div>
          </div>
        )}

                {/* Debug: Show all orders */}
        {orders && orders.length > 0 && (
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Отладка: Все заказы ({orders.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {orders.map((order: Order) => (
                  <div key={order.id} className="p-2 bg-muted/20 rounded text-sm">
                    <div className="font-medium">#{order.order_number} - {order.status}</div>
                    <div className="text-muted-foreground">
                      Позиций: {order.orderItems?.length || 0}
                      {order.orderItems?.map((item: OrderItem, index: number) => (
                        <span key={index} className="ml-2">
                          [{item.status}]
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Orders State */}
        {finalFilteredOrders.length === 0 && (
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Нет активных заказов для кухни
              </h3>
              <div className="text-muted-foreground space-y-2">
                <p>Все заказы готовы или нет новых заказов</p>
                <div className="text-xs mt-4 p-3 bg-muted/30 rounded">
                  <p>Отладка:</p>
                  <p>Всего заказов: {orders?.length || 0}</p>
                  <p>После фильтрации: {filteredOrders.length}</p>
                  <p>Финальных заказов: {finalFilteredOrders.length}</p>
                  <p>Статус фильтр: {statusFilter}</p>
                  <p>Поиск: &quot;{searchQuery}&quot;</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
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

  const activeItems = order.orderItems?.filter(item => 
    !['ready', 'served', 'cancelled'].includes(item.status)
  ) || [];

  const pendingItems = activeItems.filter(item => item.status === 'pending');
  const cookingItems = activeItems.filter(item => item.status === 'cooking');

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

        {/* Кнопка разворачивания */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full border-border hover:bg-muted/50"
        >
          {isExpanded ? 'Скрыть детали' : 'Показать детали'}
        </Button>

        {/* Развернутые товары */}
        {isExpanded && (
          <div className="pt-3 border-t border-border space-y-3">
            {activeItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {item.menuItem?.name || 'Неизвестный товар'}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    ₽{Number(item.unit_price).toFixed(2)} × {item.quantity}
                  </p>
                                     {item.special_instructions && (
                     <div className="flex items-center gap-1 mt-1">
                       <AlertTriangle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                       <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                         {item.special_instructions}
                       </p>
                     </div>
                   )}
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  {item.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartCooking(order.id, item.id)}
                      className="text-xs h-7 px-2 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/40"
                    >
                                             <Clock className="w-3 h-3 mr-1" />
                      Готовить
                    </Button>
                  )}
                  {item.status === "cooking" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkReady(order.id, item.id)}
                      className="text-xs h-7 px-2 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/40"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Готово
                    </Button>
                  )}
                  {item.status === "ready" && (
                    <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                      ✓ Готово
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Сводка по статусам */}
        <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
          <span>Ожидают: {pendingItems.length}</span>
          <span>Готовятся: {cookingItems.length}</span>
          <span>Готовы: {activeItems.filter(item => item.status === 'ready').length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
