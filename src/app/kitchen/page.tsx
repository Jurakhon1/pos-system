"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
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
  User,
  Eye
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { Order, OrderItem } from "@/shared/types/orders";
import { useTheme } from "next-themes";
import { PageLayout } from "@/shared/components/PageLayout";

export default function KitchenPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();

  // Dynamic theme classes
  const isDark = theme === 'dark';
  const bgCard = isDark ? 'bg-gray-900/50' : 'bg-white';
  const bgCardHover = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50';
  const borderMain = isDark ? 'border-gray-800' : 'border-gray-200';
  const borderHover = isDark ? 'hover:border-gray-700' : 'hover:border-gray-300';
  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  // Use the useOrders hook for kitchen-specific queries
  const { 
    usePendingOrders, 
    useCookingOrders, 
    useReadyOrders,
    orders: generalOrders,
    isLoading: generalLoading,
    startCookingOrderItem,
    markOrderItemReady,
    cancelOrder,
    isStartingCooking,
    isMarkingReady,
    isCancelling
  } = useOrders();

  const { data: pendingOrders = [], isLoading: pendingLoading } = usePendingOrders('');
  const { data: cookingOrders = [], isLoading: cookingLoading } = useReadyOrders('');
  const { data: readyOrders = [], isLoading: readyLoading } = useReadyOrders('');

  // Combine all orders for kitchen - try both approaches
  const allOrders = [...pendingOrders, ...cookingOrders, ...readyOrders];
  
  // If location-specific queries return empty, try using general orders
  const fallbackOrders = generalOrders || [];
  
  // Use fallback orders if location-specific ones are empty
  const effectiveOrders: Order[] = allOrders.length > 0 ? allOrders : fallbackOrders;
  
  console.log('🔍 Kitchen Debug Info:', {
    pendingOrders: pendingOrders.length,
    cookingOrders: cookingOrders.length,
    readyOrders: readyOrders.length,
    allOrders: allOrders.length,
    generalOrders: fallbackOrders.length,
    effectiveOrders: effectiveOrders.length,
    pendingLoading,
    cookingLoading,
    readyLoading,
    generalLoading
  });
  
  // Filter orders based on search and status
  const filteredOrders = effectiveOrders.filter(order => {
    // Only show orders that have items (kitchen needs items to cook)
    if (!order.orderItems || order.orderItems.length === 0) {
      console.log('❌ Order filtered out (no items):', order.order_number, order.orderItems?.length);
      return false;
    }
    
    // For fallback orders, only show kitchen-relevant statuses
    const isKitchenRelevant = ['pending', 'cooking', 'ready'].includes(order.status);
    if (!isKitchenRelevant) {
      console.log('❌ Order filtered out (not kitchen relevant):', order.order_number, order.status);
      return false;
    }
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = !searchQuery || 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderItems?.some((item: OrderItem) => 
        item.menuItem?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    if (matchesStatus && matchesSearch) {
      console.log('✅ Order included:', order.order_number, order.status, order.orderItems.length);
    }
    
    return matchesStatus && matchesSearch;
  });

  // Get counts for different order types
  const pendingCount = effectiveOrders.filter(order => 
    order.status === 'pending' && order.orderItems && order.orderItems.length > 0
  ).length;
  
  const cookingCount = effectiveOrders.filter(order => 
    order.status === 'cooking' && order.orderItems && order.orderItems.length > 0
  ).length;
  
  const readyCount = effectiveOrders.filter(order => 
    order.status === 'ready' && order.orderItems && order.orderItems.length > 0
  ).length;

  const isLoading = pendingLoading || cookingLoading || readyLoading;

  const handleStartCooking = async (orderId: string, itemId: string) => {
    try {
      await startCookingOrderItem({ orderId, itemId });
    } catch (error) {
      console.error('Error starting cooking:', error);
    }
  };

  const handleMarkReady = async (orderId: string, itemId: string) => {
    try {
      await markOrderItemReady({ orderId, itemId });
    } catch (error) {
      console.error('Error marking ready:', error);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // The useOrders hook will automatically refetch
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cooking':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'ready':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'cooking':
        return 'Готовится';
      case 'ready':
        return 'Готово';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cooking':
        return <User className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
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
    if (diffInMinutes < 60) return `${diffInMinutes} мин`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}ч ${diffInMinutes % 60}м`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-100 mb-2">Загрузка кухни</h2>
          <p className="text-gray-400">Подготавливаем заказы...</p>
        </div>
      </div>
    );
  }

  // Stats for the header
  const stats = [
    {
      title: "Ожидает",
      value: pendingCount.toString(),
      icon: Clock,
      color: "text-amber-600"
    },
    {
      title: "Готовится",
      value: cookingCount.toString(),
      icon: User,
      color: "text-orange-600"
    },
    {
      title: "Готово",
      value: readyCount.toString(),
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Всего заказов",
      value: effectiveOrders.length.toString(),
      icon: Package,
      color: "text-blue-600"
    }
  ];

  // Filters component
  const filters = (
    <div className="flex items-center gap-4">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className={`px-4 py-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} border ${borderMain} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${textMain}`}
      >
        <option value="all">Все статусы</option>
        <option value="pending">Ожидает ({pendingCount})</option>
        <option value="cooking">Готовится ({cookingCount})</option>
        <option value="ready">Готово ({readyCount})</option>
      </select>
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700' : `${borderMain} ${textSecondary} ${borderHover}`}
        >
          Сетка
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700' : `${borderMain} ${textSecondary} ${borderHover}`}
        >
          Список
        </Button>
      </div>
    </div>
  );

  return (
    <PageLayout
      title="Кухня"
      subtitle={`${effectiveOrders.length} заказов`}
      icon={<Package className="w-8 h-8" />}
      stats={stats}
      showSearch={true}
      searchPlaceholder="Поиск по номеру заказа, клиенту или блюду..."
      onSearch={handleSearch}
      showFilters={true}
      filters={filters}
      showRefresh={true}
      onRefresh={handleRefresh}
      loading={refreshing}
    >
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className={`w-20 h-20 ${textMuted} mx-auto mb-6`} />
          <h3 className={`text-xl font-medium ${textMain} mb-2`}>Нет заказов для кухни</h3>
          <p className={textMuted}>
            {effectiveOrders.length === 0 
              ? 'Заказы не найдены' 
              : 'Все заказы пустые или не содержат позиций для приготовления'
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredOrders.map((order) => (
            <Card key={order.id} className={`${bgCard} border ${borderMain} overflow-hidden ${borderHover} transition-all duration-200 hover:shadow-2xl ${isDark ? 'hover:shadow-black/20' : 'hover:shadow-gray-200/50'}`}>
              <CardHeader className={`pb-4 ${isDark ? 'bg-gradient-to-r from-gray-900/50 to-gray-800/30' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={`text-xl font-bold ${textMain} mb-2`}>
                      {order.order_number || `Заказ #${order.id.slice(-6)}`}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{getStatusText(order.status)}</span>
                      </Badge>
                      <span className={`text-sm ${textSecondary} flex items-center gap-1`}>
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(order.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm ${textSecondary} mb-1`}>
                      {formatTime(order.created_at)}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${textSecondary}`}>
                      {order.order_type === 'dine_in' ? (
                        <>
                          <Users className="w-4 h-4" />
                          Стол {order.table?.number || '?'}
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4" />
                          На вынос
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Customer Info */}
                <div className={`mb-6 p-4 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} rounded-xl border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                  <div className={`flex items-center gap-2 text-sm ${textMain} mb-2`}>
                    <span className="font-medium">Клиент:</span>
                    <span>{order.customer_name || 'Не указан'}</span>
                  </div>
                  {order.customer_phone && (
                    <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                      <Phone className="w-4 h-4" />
                      <span>{order.customer_phone}</span>
                    </div>
                  )}
                  {order.table && (
                    <div className={`flex items-center gap-2 text-sm ${textSecondary} mt-2`}>
                      <Eye className="w-4 h-4" />
                      <span>{order.table.zone || 'Основной зал'} - Стол {order.table.number}</span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.orderItems?.map((item: OrderItem) => (
                    <div key={item.id} className={`p-4 ${isDark ? 'bg-gray-800/20' : 'bg-gray-50'} rounded-xl border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className={`font-semibold ${textMain}`}>{item.menuItem?.name || 'Неизвестное блюдо'}</h4>
                        <span className="text-lg font-bold text-blue-400">
                          x{item.quantity}
                        </span>
                      </div>
                      
                      {item.menuItem?.description && (
                        <p className={`text-sm ${textSecondary} mb-3`}>{item.menuItem.description}</p>
                      )}
                      
                      {item.special_instructions && (
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-orange-300 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20">
                            {item.special_instructions}
                          </span>
                        </div>
                      )}
                      
                      {/* Item Actions */}
                      <div className="flex gap-3">
                        {item.status === 'pending' && (
                          <Button
                            onClick={() => handleStartCooking(order.id, item.id)}
                            disabled={isStartingCooking}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white border-0"
                          >
                            <User className="w-4 h-4 mr-2" />
                            {isStartingCooking ? 'Запуск...' : 'Начать готовить'}
                          </Button>
                        )}
                        
                        {item.status === 'cooking' && (
                          <Button
                            onClick={() => handleMarkReady(order.id, item.id)}
                            disabled={isMarkingReady}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isMarkingReady ? 'Готово...' : 'Отметить готовым'}
                          </Button>
                        )}
                        
                        {item.status === 'ready' && (
                          <div className="flex-1 flex items-center justify-center text-green-400 font-medium">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Готово
                          </div>
                        )}
                      </div>
                      
                      {/* Cooking Time Info */}
                      {(item.menuItem as any)?.cooking_time && (
                        <div className={`mt-2 text-xs ${textMuted} flex items-center gap-1`}>
                          <Clock className="w-3 h-3" />
                          Время приготовления: {(item.menuItem as any).cooking_time} мин
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className={`text-center py-6 ${textMuted}`}>
                      Позиции заказа не загружены
                    </div>
                  )}
                </div>

                {/* Order Actions */}
                {['pending', 'confirmed'].includes(order.status) && (
                  <div className={`pt-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                    <Button
                      onClick={() => handleCancel(order.id)}
                      disabled={isCancelling}
                      variant="outline"
                      className={`w-full ${isDark ? 'border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50' : 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400'}`}
                    >
                      {isCancelling ? 'Отмена...' : 'Отменить заказ'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}