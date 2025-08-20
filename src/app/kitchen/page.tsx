"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Clock, CheckCircle, Loader2, Package } from "lucide-react";
import { OrdersApi } from "@/entities/orders/api/ordersApi";
import { Order, OrderItem } from "@/shared/types/orders";

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultLocationId = '2';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pending, cooking, ready] = await Promise.all([
        OrdersApi.getPendingOrders(defaultLocationId),
        OrdersApi.getCookingOrders(defaultLocationId),
        OrdersApi.getReadyOrders(defaultLocationId)
      ]);
      const allOrders = [...pending, ...cooking, ...ready];
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

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      cooking: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      ready: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      pending: 'Ожидает',
      cooking: 'Готовится',
      ready: 'Готово',
      cancelled: 'Отменен'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      pending: <Clock className="w-4 h-4" />,
      cooking: <Loader2 className="w-4 h-4 animate-spin" />,
      ready: <CheckCircle className="w-4 h-4" />,
      cancelled: <CheckCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const handleStartCookingItem = async (orderId: string, itemId: string) => {
    try {
      await OrdersApi.startCookingOrderItem(orderId, itemId);
      await fetchOrders();
    } catch (err) {
      setError('Ошибка начала приготовления');
    }
  };

  const handleMarkItemReady = async (orderId: string, itemId: string) => {
    try {
      await OrdersApi.markOrderItemReady(orderId, itemId);
      await fetchOrders();
    } catch (err) {
      setError('Ошибка отметки готовности');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await OrdersApi.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      setError('Ошибка отмены заказа');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 mx-4 mt-4 rounded border border-red-200 dark:border-red-800">
          {error}
          <Button variant="outline" size="sm" onClick={fetchOrders} className="ml-2">
            Повторить
          </Button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Нет заказов</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">
                      {order.order_number || `Заказ #${order.id.slice(-6)}`}
                    </CardTitle>
                   
                  </div>
                  <div className="flex w-full">
                  <Badge className={`${getStatusColor(order.status)} w-full flex`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusText(order.status)}</span>
                  </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between p-3 border border-border rounded bg-card">
                        <div>
                          <h4 className="font-medium text-card-foreground">{item.menuItem?.name || 'Неизвестно'}</h4>
                          <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                        </div>
                        <div>
                          {item.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartCookingItem(order.id, item.id)}
                            >
                              Готовить
                            </Button>
                          )}
                          {item.status === 'cooking' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkItemReady(order.id, item.id)}
                              className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}