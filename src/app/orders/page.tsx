"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
  Search, 
  Clock, 
  User, 
  Table,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  FileText,
  CreditCard,
  DollarSign
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { Order, OrderItem, ORDER_STATUSES, PaymentRequest } from "@/shared/types/orders";
import { RoleGuard, RoleBasedContent } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";
import { PageLayout } from "@/shared/components/PageLayout";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mixed">("cash");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const { 
    orders, 
    isLoading, 
    error, 
    refetch, 
    processPayment, 
    isProcessingPayment,
    updateOrderStatus,
    isUpdatingStatus
  } = useOrders();

  // reset при выборе нового заказа
  useEffect(() => {
    if (selectedOrder) {
      const orderTotal = Number(selectedOrder.total_amount);
      setCashAmount(orderTotal);
      setCardAmount(0);
      setDiscountAmount(0);
      setPaymentMethod("cash");
    }
  }, [selectedOrder]);

  const getTotalPaymentAmount = () => {
    if (paymentMethod === "cash") return cashAmount;
    if (paymentMethod === "card") return cardAmount;
    if (paymentMethod === "mixed") return (cashAmount || 0) + (cardAmount || 0);
    return 0;
  };

  const isPaymentValid = () => {
    if (!selectedOrder) return false;
    const totalPaid = getTotalPaymentAmount();
    const orderTotal = Number(selectedOrder.total_amount);
    return totalPaid >= orderTotal;
  };

  // Helper function to force decimal representation
  const forceDecimal = (value: number): number => {
    // Принудительно создаем decimal представление
    const decimalString = value.toFixed(2);
    // Преобразуем обратно в число, но сохраняем decimal
    const result = parseFloat(decimalString);
    // Проверяем, что результат действительно имеет decimal
    if (result === Math.floor(result)) {
      // Если число целое, принудительно добавляем .00
      return parseFloat(result.toFixed(2));
    }
    return result;
  };

  // 💳 Отправка платежа
  const handlePayment = async () => {
    if (!selectedOrder || !isPaymentValid()) return;

    try {
      // Создаем данные для API как числа с принудительным decimal форматированием
      const paymentData: PaymentRequest = {
        paymentMethod,
        discountAmount: Number((discountAmount || 0).toFixed(2)),
        ...(paymentMethod === "cash" && { 
          cashAmount: Number(getTotalPaymentAmount().toFixed(2))
        }),
        ...(paymentMethod === "card" && { 
          cardAmount: Number(getTotalPaymentAmount().toFixed(2))
        }),
        ...(paymentMethod === "mixed" && { 
          cashAmount: Number((cashAmount || 0).toFixed(2)), 
          cardAmount: Number((cashAmount || 0).toFixed(2))
        })
      };

      console.log("🚀 Отправляем на API:", paymentData);
      console.log("🔍 Decimal validation:", {
        discountAmount: {
          value: paymentData.discountAmount,
          type: typeof paymentData.discountAmount,
          hasDecimals: paymentData.discountAmount.toString().includes('.')
        },
        cashAmount: paymentData.cashAmount ? {
          value: paymentData.cashAmount,
          type: typeof paymentData.cashAmount,
          hasDecimals: paymentData.cashAmount.toString().includes('.')
        } : 'N/A',
        cardAmount: paymentData.cardAmount ? {
          value: paymentData.cardAmount,
          type: typeof paymentData.cardAmount,
          hasDecimals: paymentData.cardAmount.toString().includes('.')
        } : 'N/A'
      });

      await processPayment({ orderId: selectedOrder.id, paymentData });
      setIsPaymentModalOpen(false);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error("Ошибка платежа:", error);
      alert("Ошибка при обработке платежа");
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // Helper function for API: always returns string with decimal format
  const formatDecimalString = (value: number): string => {
    return Number(value).toFixed(2);
  };

  // Helper function for API: always returns number with decimal format
  const formatDecimalNumber = (value: number): number => {
    // Принудительно создаем decimal представление
    const decimalString = Number(value).toFixed(2);
    // Добавляем .00 если число целое
    if (decimalString.endsWith('.00')) {
      return parseFloat(decimalString);
    }
    // Для чисел с десятичными знаками
    return parseFloat(decimalString);
  };

  // Handle input changes
  const handleCashAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setCashAmount(numValue);
    
    // Автоматически обновляем поле карты при смешанном способе
    if (paymentMethod === 'mixed' && selectedOrder) {
      const orderTotal = Number(selectedOrder.total_amount);
      const discount = discountAmount || 0;
      const amountToPay = orderTotal - discount;
      setCardAmount(Math.max(0, amountToPay - numValue));
    }
  };

  const handleCardAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setCardAmount(numValue);
    
    // Автоматически обновляем поле наличных при смешанном способе
    if (paymentMethod === 'mixed' && selectedOrder) {
      const orderTotal = Number(selectedOrder.total_amount);
      const discount = discountAmount || 0;
      const amountToPay = orderTotal - discount;
      setCashAmount(Math.max(0, amountToPay - numValue));
    }
  };

  const handleDiscountAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setDiscountAmount(numValue);
    
    // Автоматически обновляем поля оплаты при изменении скидки
    if (selectedOrder) {
      const orderTotal = Number(selectedOrder.total_amount);
      const amountToPay = orderTotal - numValue;
      
      if (paymentMethod === 'cash') {
        setCashAmount(amountToPay);
      } else if (paymentMethod === 'card') {
        setCardAmount(amountToPay);
      } else if (paymentMethod === 'mixed') {
        setCashAmount(Math.floor(amountToPay / 2));
        setCardAmount(amountToPay - Math.floor(amountToPay / 2));
      }
    }
  };

  // Calculate change amount
  const getChangeAmount = () => {
    if (!selectedOrder) return 0;
    const totalPaid = getTotalPaymentAmount();
    const orderTotal = Number(selectedOrder.total_amount);
    return Math.max(0, totalPaid - orderTotal);
  };

  // Helper function to format monetary values for display
  const formatMoney = (amount: number) => {
    return Number(amount).toFixed(2);
  };

  // Фильтрация заказов
  const filteredOrders = orders?.filter((order: Order) => {
    const matchesSearch = !searchTerm || 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all' && order.created_at) {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = orderDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  // Статистика для заголовка
  const stats = [
    {
      title: "Всего заказов",
      value: orders?.length?.toString() || "0",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Ожидает",
      value: orders?.filter((o: Order) => o.status === 'pending').length?.toString() || "0",
      icon: Clock,
      color: "text-amber-600"
    },
    {
      title: "Готовится",
      value: orders?.filter((o: Order) => o.status === 'cooking').length?.toString() || "0",
      icon: User,
      color: "text-orange-600"
    },
    {
      title: "Готово",
      value: orders?.filter((o: Order) => o.status === 'ready').length?.toString() || "0",
      icon: CheckCircle,
      color: "text-green-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cooking':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'ready':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'cooking':
        return 'Готовится';
      case 'ready':
        return 'Готов';
      case 'completed':
        return 'Завершен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2">Загрузка заказов</h2>
          <p className="text-gray-500">Подготавливаем данные...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard requiredRoles={[USER_ROLES.CASHIER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
      <PageLayout
        title="📋 Управление заказами"
        subtitle="Просмотр и управление всеми заказами ресторана"
        icon={<FileText className="w-8 h-8" />}
        stats={stats}
        showSearch={true}
        searchPlaceholder="Поиск по номеру, клиенту..."
        onSearch={setSearchTerm}
        showRefresh={true}
        onRefresh={refetch}
        loading={isLoading}
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium">{error.message}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()} 
                className="ml-4 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                Повторить
              </Button>
            </div>
          </div>
        )}

        {/* Фильтры */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Фильтр по статусу */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
              >
                <option value="all">📊 Все статусы</option>
                <option value="pending">⏳ Ожидает</option>
                <option value="cooking">👨‍🍳 Готовится</option>
                <option value="ready">✅ Готов</option>
                <option value="completed">🎯 Завершен</option>
                <option value="cancelled">❌ Отменен</option>
              </select>
            </div>

            {/* Фильтр по дате */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
              >
                <option value="all">📅 Все даты</option>
                <option value="today">🌅 Сегодня</option>
                <option value="week">📆 За неделю</option>
                <option value="month">🗓️ За месяц</option>
              </select>
            </div>

            {/* Кнопка сброса фильтров */}
            <Button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-6 py-3 rounded-xl transition-all duration-200"
            >
              🔄 Сбросить фильтры
            </Button>

            {/* Debug button for testing decimal formatting */}
            <Button 
              onClick={() => {
                const testAmounts = [252, 0, 100.5, 99.99, 1000];
                console.log('=== DECIMAL FORMATTING TEST ===');
                testAmounts.forEach(amount => {
                  const formatted = parseFloat(amount.toFixed(2));
                  const final = Number(formatted.toFixed(2));
                  console.log(`Amount: ${amount}`, {
                    formatted: formatted,
                    final: final,
                    formattedString: formatted.toString(),
                    finalString: final.toString(),
                    hasDecimals: final.toString().includes('.'),
                    isValidDecimal: final.toString().includes('.') && final.toString().split('.')[1].length === 2
                  });
                });
                console.log('=== END TEST ===');
              }}
              variant="outline"
              className="w-full border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-700/50 px-6 py-3 rounded-xl transition-all duration-200"
            >
              🐛 Тест Decimal
            </Button>
          </div>
        </div>

        {/* Список заказов */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🔍 Заказы не найдены
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Попробуйте изменить фильтры или создать новый заказ в системе
              </p>
            </div>
          ) : (
            filteredOrders.map((order: Order) => (
              <Card key={order.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-gray-700/20 hover:border-blue-200/50 dark:hover:border-blue-600/50 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          📋 Заказ #{order.order_number || order.id.slice(-6)}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                            ({order.orderItems?.length || 0} позиций)
                          </span>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Не указано'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-green-500" />
                            <span>{order.customer_name || 'Не указано'}</span>
                          </div>

                          {order.customer_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-purple-500" />
                              <span>{order.customer_phone}</span>
                            </div>
                          )}

                          {order.table && (
                            <div className="flex items-center gap-2">
                              <Table className="w-4 h-4 text-orange-500" />
                              <span>Стол {order.table.number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        ₽{Number(order.total_amount).toFixed(2)}
                      </div>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{getStatusText(order.status)}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Позиции заказа */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Позиции заказа:
                      </h4>
                      <div className="space-y-2">
                        {order.orderItems.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {item.menuItem?.name || 'Неизвестное блюдо'}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                x{item.quantity}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                ₽{Number(item.total_price).toFixed(2)}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {getStatusText(item.status)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Примечания */}
                  {order.notes && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📝</span>
                        <div>
                          <h5 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
                            Примечания к заказу
                          </h5>
                          <p className="text-amber-700 dark:text-amber-400">
                            {order.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Кнопки действий */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Кнопка обработки платежа - только для cashier */}
                    <RoleBasedContent roles={[USER_ROLES.CASHIER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
                      {order.status === 'ready' && (
                        <Button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsPaymentModalOpen(true);
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Обработка...
                            </>
                          ) : (
                            <>
                              💳 Обработать платеж
                            </>
                          )}
                        </Button>
                      )}
                    </RoleBasedContent>
                    
                    {/* Кнопки изменения статуса - только для waiter */}
                    <RoleBasedContent roles={[USER_ROLES.WAITER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
                      {order.status === 'pending' && (
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'cooking')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isUpdatingStatus}
                        >
                          {isUpdatingStatus ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Обновление...
                            </>
                          ) : (
                            <>
                              👨‍🍳 Начать готовить
                            </>
                          )}
                        </Button>
                      )}
                      
                      {order.status === 'cooking' && (
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'ready')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          disabled={isUpdatingStatus}
                        >
                          {isUpdatingStatus ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Обновление...
                            </>
                          ) : (
                            <>
                              ✅ Готово
                            </>
                          )}
                        </Button>
                      )}
                    </RoleBasedContent>
                    
                    {/* Кнопка редактирования - для всех ролей с доступом */}
                    <Button 
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      ✏️ Редактировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Модальное окно платежей - только для cashier */}
        <RoleBasedContent roles={[USER_ROLES.CASHIER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
          {isPaymentModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">💳 Обработка платежа</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Заказ #{selectedOrder.order_number}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsPaymentModalOpen(false)} 
                  size="sm"
                >
                  ✕
                </Button>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  ₽{Number(selectedOrder.total_amount).toFixed(2)}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Сумма к оплате</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  💡 Поля оплаты заполняются автоматически
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Способ оплаты:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => {
                      setPaymentMethod('cash');
                      if (selectedOrder) {
                        const orderTotal = Number(selectedOrder.total_amount);
                        const discount = discountAmount || 0;
                        setCashAmount(orderTotal - discount);
                        setCardAmount(0);
                      }
                    }}
                    className="text-sm"
                  >
                    💵 Наличные
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => {
                      setPaymentMethod('card');
                      if (selectedOrder) {
                        const orderTotal = Number(selectedOrder.total_amount);
                        const discount = discountAmount || 0;
                        setCardAmount(orderTotal - discount);
                        setCashAmount(0);
                      }
                    }}
                    className="text-sm"
                  >
                    💳 Карта
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'mixed' ? 'default' : 'outline'}
                    onClick={() => {
                      setPaymentMethod('mixed');
                      if (selectedOrder) {
                        const orderTotal = Number(selectedOrder.total_amount);
                        const discount = discountAmount || 0;
                        const amountToPay = orderTotal - discount;
                        setCashAmount(Math.floor(amountToPay / 2));
                        setCardAmount(amountToPay - Math.floor(amountToPay / 2));
                      }
                    }}
                    className="text-sm"
                  >
                    🔄 Смешанно
                  </Button>
                </div>
              </div>

              {/* Payment Amount Inputs */}
              <div className="space-y-4 mb-6">
                {paymentMethod === 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Сумма наличными:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cashAmount || ''}
                      onChange={(e) => handleCashAmountChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Автоматически заполнено суммой заказа
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Сумма картой:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cardAmount || ''}
                      onChange={(e) => handleCardAmountChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Автоматически заполнено суммой заказа
                    </p>
                  </div>
                )}

                {paymentMethod === 'mixed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Наличные:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={cashAmount || ''}
                        onChange={(e) => handleCashAmountChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Автоматически распределено
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Карта:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={cardAmount || ''}
                        onChange={(e) => handleCardAmountChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Автоматически распределено
                      </p>
                    </div>
                  </div>
                )}

                {/* Discount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Скидка:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={Number(selectedOrder.total_amount)}
                    value={discountAmount || ''}
                    onChange={(e) => handleDiscountAmountChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    При изменении скидки поля оплаты обновляются автоматически
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Сумма заказа:</span>
                    <span className="font-medium">₽{formatMoney(Number(selectedOrder.total_amount))}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Скидка:</span>
                    <span className="font-medium text-red-600">-₽{formatMoney(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">К оплате:</span>
                    <span className="font-medium text-green-600">₽{formatMoney(Number(selectedOrder.total_amount) - discountAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-right text-sm text-gray-600 dark:text-gray-400">Внесено:</span>
                    <span className="font-medium">₽{formatMoney(getTotalPaymentAmount())}</span>
                  </div>
                  {getChangeAmount() > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Сдача:</span>
                      <span className="font-medium text-blue-600">₽{formatMoney(getChangeAmount())}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!isPaymentValid() || isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Обработка платежа...
                    </>
                  ) : (
                    <>
                      💳 Обработать платеж
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-full"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}
        </RoleBasedContent>
      </PageLayout>
    </RoleGuard>
  );
}
