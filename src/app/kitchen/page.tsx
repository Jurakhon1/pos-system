"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Package,
  Loader2,
  Search,
  Filter,
  Users,
  Phone,
  Plus,
  Minus,
  Edit,
  Eye
} from "lucide-react";
import { useKitchen } from "@/entities/kitchen";
import { OrdersApi } from "@/entities/orders/api/ordersApi";
import { Order, OrderItem } from "@/shared/types/orders";

// Simple Badge component
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Default location ID - в реальном приложении это должно приходить из контекста пользователя
  const defaultLocationId = '2'; // Можно вынести в конфиг или получать из auth context

  // Fetch orders from backend using new API methods
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Получаем заказы по статусам для кухни
      const [pendingOrders, cookingOrders, readyOrders] = await Promise.all([
        OrdersApi.getPendingOrders(defaultLocationId),
        OrdersApi.getCookingOrders(defaultLocationId),
        OrdersApi.getReadyOrders(defaultLocationId)
      ]);
      
      // Объединяем все заказы, которые нужны кухне
      const allKitchenOrders = [
        ...pendingOrders,
        ...cookingOrders,
        ...readyOrders
      ];
      
      setOrders(allKitchenOrders);
      setFilteredOrders(allKitchenOrders);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Ошибка загрузки заказов');
      // Fallback to empty array if API fails
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter orders based on status and search
  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems?.some(item => 
          item.menuItem?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cooking':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'served':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'paid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        return 'Готово';
      case 'served':
        return 'Подано';
      case 'paid':
        return 'Оплачено';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <Clock className="w-4 h-4" />;
      case 'cooking':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'served':
        return <CheckCircle className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Handle individual order item actions
  const handleStartCookingItem = async (orderId: string, itemId: string) => {
    try {
      // Start cooking specific item via API endpoint: PUT /orders/{id}/items/{itemId}/start-cooking
      // Backend requires cook_id, API will use default cook ID
      await OrdersApi.startCookingOrderItem(orderId, itemId);
      // Refresh orders to get updated status
      await fetchOrders();
      console.log(`Started cooking item ${itemId} from order ${orderId}`);
    } catch (err) {
      console.error('Error starting cooking item:', err);
      setError('Ошибка начала приготовления блюда');
    }
  };

  const handleMarkItemReady = async (orderId: string, itemId: string) => {
    try {
      // Mark specific item as ready via API endpoint: PUT /orders/{id}/items/{itemId}/ready
      await OrdersApi.markOrderItemReady(orderId, itemId);
      // Refresh orders to get updated status
      await fetchOrders();
      console.log(`Marked item ${itemId} as ready from order ${orderId}`);
    } catch (err) {
      console.error('Error marking item as ready:', err);
      setError('Ошибка отметки блюда как готового');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Cancel order via API endpoint: PUT /orders/{id}/cancel
      await OrdersApi.cancelOrder(orderId);
      // Refresh orders to get updated status
      await fetchOrders();
      console.log(`Order ${orderId} cancelled`);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Ошибка отмены заказа');
    }
  };

  const handleUpdateItemQuantity = async (orderId: string, itemId: string, newQuantity: number) => {
    try {
      // Update item quantity via API endpoint: PATCH /orders/{id}/items/{itemId}/quantity
      await OrdersApi.updateOrderItemQuantity(orderId, itemId, newQuantity);
      // Refresh orders to get updated data
      await fetchOrders();
      console.log(`Updated quantity for item ${itemId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating item quantity:', err);
      setError('Ошибка обновления количества');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeAgo = (dateString: string | Date) => {
    const now = new Date();
    const orderTime = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ч ${diffInMinutes % 60} мин назад`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Загрузка кухни...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mx-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="block sm:inline">{error}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <Loader2 className="w-4 h-4 mr-1" />
                Повторить
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-700 hover:bg-red-100"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

     

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет заказов</h3>
            <p className="text-gray-500">По выбранным фильтрам заказы не найдены</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {order.order_number || `Заказ #${order.id.slice(-6)}`}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {getTimeAgo(order.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        {order.order_type === 'dine_in' ? (
                          <>
                            <Users className="w-4 h-4" />
                            Стол {order.table?.number || 'Не указан'}
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4" />
                            На вынос
                          </>
                        )}
                      </div>
                      
                      {/* Cancel order button */}
                      {['pending', 'confirmed'].includes(order.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="mt-2 text-red-600 border-red-300 hover:bg-red-50 text-xs px-2 py-1 h-6"
                        >
                          Отменить заказ
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Customer Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="font-medium">Клиент:</span>
                      <span>{order.customer_name || 'Не указан'}</span>
                    </div>
                    {order.customer_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                        <Phone className="w-4 h-4" />
                        <span>{order.customer_phone}</span>
                      </div>
                    )}
                    {order.table && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                        <Eye className="w-4 h-4" />
                        <span>{order.table.zone || 'Основной зал'} - Стол {order.table.number}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{item.menuItem?.name || 'Неизвестное блюдо'}</h4>
                            <span className="text-sm font-medium text-gray-700">
                              x{item.quantity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.menuItem?.description || 'Описание отсутствует'}</p>
                          {item.special_instructions && (
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-orange-700 bg-orange-50 px-2 py-1 rounded">
                                {item.special_instructions}
                              </span>
                            </div>
                          )}
                          
                          {/* Item-specific actions */}
                          <div className="flex gap-2 mt-3">
                            {item.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartCookingItem(order.id, item.id)}
                                className="text-xs px-2 py-1 h-7"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Готовить
                              </Button>
                            )}
                            {item.status === 'cooking' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkItemReady(order.id, item.id)}
                                className="text-xs px-2 py-1 h-7 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Готово
                              </Button>
                            )}
                            {item.status === 'ready' && (
                              <span className="text-sm text-green-600 font-medium">
                                ✓ Готово
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-gray-500">
                        Позиции заказа не загружены
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
