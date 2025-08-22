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
  Calendar
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { Order, OrderItem, ORDER_STATUSES, PaymentRequest } from "@/shared/types/orders";
import { ToastContainer, ToastProps } from "@/shared/ui/toast";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

// Модальное окно для обработки платежейn
const PaymentModal = ({ order, isOpen, onClose, onPayment }: { 
  order: Order | null; 
  isOpen: boolean; 
  onClose: () => void;
  onPayment: (orderId: string, paymentData: PaymentRequest) => void;
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mixed'>('cash');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<string>('');

  if (!isOpen || !order) return null;

  const totalAmount = Number(order.total_amount);
  const discount = Number(discountAmount) || 0;
  const finalTotal = totalAmount - discount;

  const handleSubmit = () => {
    const paymentData: PaymentRequest = { 
      paymentMethod,
      discountAmount: formatAsDecimal(discountAmount)
    };

    if (paymentMethod === 'cash') {
      paymentData.cashAmount = formatAsDecimal(cashAmount || finalTotal);
    } else if (paymentMethod === 'card') {
      paymentData.cardAmount = formatAsDecimal(cardAmount || finalTotal);
    } else if (paymentMethod === 'mixed') {
      paymentData.cashAmount = formatAsDecimal(cashAmount);
      paymentData.cardAmount = formatAsDecimal(cardAmount);
    }

    onPayment(order.id, paymentData);
    onClose();
    // Сброс формы
    setPaymentMethod('cash');
    setCashAmount('');
    setCardAmount('');
    setDiscountAmount('');
  };

  // Функция для форматирования чисел как decimal
  const formatAsDecimal = (value: string | number): number => {
    const num = Number(value) || 0;
    // Округляем до 2 знаков после запятой для корректного decimal формата
    return Math.round(num * 100) / 100;
  };

  const canSubmit = () => {
    if (paymentMethod === 'mixed') {
      const cash = Number(cashAmount) || 0;
      const card = Number(cardAmount) || 0;
      return (cash + card) >= finalTotal;
    }
    return true;
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">💳 Обработка платежа</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Выберите способ оплаты</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              size="sm"
              className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          
          <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-200/50 dark:border-gray-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  📋 Заказ #{order.order_number}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Общая сумма: <span className="font-bold text-blue-600 dark:text-blue-400">₽{totalAmount.toFixed(2)}</span>
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🧾</span>
              </div>
            </div>
          </div>

          {/* Метод оплаты */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              💳 Способ оплаты
            </label>
            <div className="space-y-3">
              {[
                { value: 'cash', icon: '💵', label: 'Наличные', desc: 'Оплата наличными деньгами' },
                { value: 'card', icon: '💳', label: 'Банковская карта', desc: 'Оплата картой или безналичным способом' },
                { value: 'mixed', icon: '💰', label: 'Смешанная оплата', desc: 'Частично наличными, частично картой' }
              ].map((method) => (
                <label 
                  key={method.value}
                  className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/30 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'mixed')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      paymentMethod === method.value
                        ? 'bg-blue-100 dark:bg-blue-800/50'
                        : 'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      {method.icon}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        paymentMethod === method.value
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {method.label}
                      </div>
                      <div className={`text-sm ${
                        paymentMethod === method.value
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {method.desc}
                      </div>
                    </div>
                  </div>
                  {paymentMethod === method.value && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Скидка */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              💰 Скидка
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₽</div>
              <input
                type="number"
                placeholder="0.00"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                min="0"
                max={totalAmount}
                step="0.01"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Поля для ввода сумм в зависимости от метода */}
          {paymentMethod === 'cash' && (
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                💵 Сумма наличными
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₽</div>
                <input
                  type="number"
                  placeholder={finalTotal.toFixed(2)}
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                💳 Сумма картой
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₽</div>
                <input
                  type="number"
                  placeholder={finalTotal.toFixed(2)}
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'mixed' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  💵 Сумма наличными
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₽</div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  💳 Сумма картой
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₽</div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Итоговая сумма */}
          <div className="mb-8 bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-green-50/80 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 backdrop-blur-sm rounded-2xl p-5 border border-green-200/50 dark:border-green-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                  💰
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Итого к оплате
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    {discount > 0 && `Скидка: ₽${discount.toFixed(2)}`}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                ₽{finalTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 py-3 px-6 rounded-xl transition-all duration-200"
            >
              ❌ Отмена
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!canSubmit()}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                canSubmit()
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Обработать платеж</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const {orders,isLoading,error,refetch }=useOrders()

  // Добавляем useEffect для фильтрации заказов
  useEffect(() => {
    if (!orders) return;
    
    let filtered = [...orders];
    
    // Фильтрация по поиску
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone?.includes(searchTerm)
      );
    }
    
    // Фильтрация по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Фильтрация по дате
    if (dateFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Функция обработки платежей
  const handlePayment = (orderId: string, paymentData: PaymentRequest) => {
    console.log('Обработка платежа:', { orderId, paymentData });
    // TODO: Интегрировать с API для обработки платежей
    // Здесь должна быть логика отправки данных на сервер
  };

  // Функции для управления сворачиванием/разворачиванием
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const isOrderExpanded = (orderId: string) => expandedOrders.has(orderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'cooking': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'cooking': return 'Готовится';
      case 'ready': return 'Готов';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-6 h-6 text-white" />;
      case 'cooking': return <Loader2 className="w-6 h-6 text-white animate-spin" />;
      case 'ready': return <CheckCircle className="w-6 h-6 text-white" />;
      case 'completed': return <CheckCircle className="w-6 h-6 text-white" />;
      case 'cancelled': return <XCircle className="w-6 h-6 text-white" />;
      default: return <Clock className="w-6 h-6 text-white" />;
    }
  };

  const calculateTotal = (order: Order) => {
    return Number(order.total_amount) || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard requiredRoles={[USER_ROLES.CASHIER, USER_ROLES.WAITER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
          {/* Заголовок */}
          <div className="mb-8 lg:mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-2xl blur-3xl"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-3">
                      📋 Управление заказами
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg">
                      Просмотр и управление всеми заказами ресторана
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Онлайн</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Фильтры и поиск */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-4 sm:p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Поиск */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
                <input
                  type="text"
                  placeholder="Поиск по номеру, клиенту..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

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
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Кнопка обновления */}
              <Button 
                onClick={() => refetch()} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Обновить</span>
              </Button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
            {['pending', 'cooking', 'ready', 'completed', 'cancelled'].map((status, index) => {
              const count = orders.filter((order: Order) => order.status === status).length;
              const isActive = statusFilter === status;
              return (
                <div
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                  className={`relative group cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                    isActive ? 'scale-105' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl border transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-300 dark:border-blue-600 shadow-blue-200/50 dark:shadow-blue-900/50' 
                      : 'border-white/20 dark:border-gray-700/20 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl mb-3 lg:mb-4 shadow-lg transition-all duration-300 ${getStatusColor(status)} ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`}>
                        {getStatusIcon(status)}
                      </div>
                      <p className={`text-2xl lg:text-3xl font-bold mb-1 transition-colors duration-300 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {count}
                      </p>
                      <p className={`text-xs lg:text-sm font-medium transition-colors duration-300 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {getStatusText(status)}
                      </p>
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Список заказов */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 via-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-12 lg:p-16 text-center shadow-2xl border border-white/20 dark:border-gray-700/20">
                  <div className="relative">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-inner">
                      <Clock className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      🔍 Заказы не найдены
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg mb-6 max-w-md mx-auto">
                      Попробуйте изменить фильтры или создать новый заказ в системе
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setDateFilter('all');
                        }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        🔄 Сбросить фильтры
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => refetch()}
                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-6 py-3 rounded-xl transition-all duration-200"
                      >
                        🔄 Обновить данные
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="relative group animate-fade-in-up"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-gray-700/20 hover:border-blue-200/50 dark:hover:border-blue-600/50 transition-all duration-300 overflow-hidden">
                    {/* Заголовок карточки */}
                    <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700/50">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                              📋 Заказ #{order.order_number || order.id.slice(-6)}
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                ({order.orderItems?.length || 0} позиций)
                              </span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">
                                  {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Не указано'}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4 text-green-500" />
                                <span className="font-medium">{order.customer_name || 'Не указано'}</span>
                              </div>

                              {order.customer_phone && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <Phone className="w-4 h-4 text-purple-500" />
                                  <span className="font-medium">{order.customer_phone}</span>
                                </div>
                              )}

                              {order.table && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <Table className="w-4 h-4 text-orange-500" />
                                  <span className="font-medium">
                                    Стол {order.table.number}
                                    {order.table.zone && ` (${order.table.zone})`}
                                  </span>
                                </div>
                              )}

                              {order.waiter && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <User className="w-4 h-4 text-indigo-500" />
                                  <span className="font-medium">{order.waiter.name}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4 text-pink-500" />
                                <span className="font-medium">Гостей: {order.guest_count}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                                    order.order_type === 'dine_in' 
                                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700' 
                                      : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                                  }`}
                                >
                                  {order.order_type === 'dine_in' ? '🍽️ В ресторане' : '📦 На вынос'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                          <div className="text-right">
                            {order.discount_amount > 0 && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1">
                                ₽{Number(order.subtotal).toFixed(2)}
                              </div>
                            )}
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              ₽{calculateTotal(order)}
                            </div>
                            {order.discount_amount > 0 && (
                              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                💰 Скидка: ₽{Number(order.discount_amount).toFixed(2)}
                              </div>
                            )}
                            {order.payment_method && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {order.payment_method === 'cash' ? '💵 Наличные' : 
                                 order.payment_method === 'card' ? '💳 Карта' : '💵💳 Смешанная'}
                                {order.payment_method === 'mixed' && order.cash_amount && order.card_amount && (
                                  <div className="mt-1 space-y-1">
                                    <div>💵 {Number(order.cash_amount).toFixed(2)} ₽</div>
                                    <div>💳 {Number(order.card_amount).toFixed(2)} ₽</div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge 
                              className={`${getStatusColor(order.status)} px-4 py-2 rounded-full text-sm font-medium shadow-lg`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-2">{getStatusText(order.status)}</span>
                            </Badge>
                            
                            {/* Кнопка сворачивания/разворачивания */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleOrderExpansion(order.id)}
                              className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
                            >
                              <svg 
                                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                                  isOrderExpanded(order.id) ? 'rotate-180' : 'rotate-0'
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Контент карточки */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOrderExpanded(order.id) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                        {/* Позиции заказа */}
                        <div className="space-y-4 mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            🍽️ Позиции заказа
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              ({order.orderItems?.length || 0} шт.)
                            </span>
                          </h4>
                          {order.orderItems?.map((item) => (
                          <div key={item.id} className="relative bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-200 dark:hover:border-blue-600/50 transition-all duration-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2">
                                  {item.menuItem?.name || 'Неизвестно'}
                                </h5>
                                
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                                    <strong>x{item.quantity}</strong>
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                                    ₽{Number(item.unit_price).toFixed(2)}
                                  </span>
                                  <Badge 
                                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                                      item.status === 'ready' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                      item.status === 'cooking' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                      item.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                    }`}
                                  >
                                    {item.status === 'ready' ? '✅ Готово' :
                                     item.status === 'cooking' ? '👨‍🍳 Готовится' :
                                     item.status === 'pending' ? '⏳ Ожидает' :
                                     item.status}
                                  </Badge>
                                </div>

                                {/* Дополнительная информация */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {item.cook && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                      <span className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                        👨‍🍳
                                      </span>
                                      <span>{item.cook.name}</span>
                                    </div>
                                  )}
                                  
                                  {item.cooking_started_at && (
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                      <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        ⏰
                                      </span>
                                      <span>Начало: {new Date(item.cooking_started_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  )}
                                  
                                  {item.ready_at && (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                      <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        ✅
                                      </span>
                                      <span>Готово: {new Date(item.ready_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  )}
                                  
                                  {item.cooking_completed_at && (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                      <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        🎯
                                      </span>
                                      <span>Завершено: {new Date(item.cooking_completed_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  )}
                                </div>

                                {item.special_instructions && (
                                  <div className="mt-3 p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500">
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-500 mt-0.5">💬</span>
                                      <span className="text-sm text-blue-700 dark:text-blue-300 italic">
                                        {item.special_instructions}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  ₽{((item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Детализация по счету */}
                      <div className="bg-gradient-to-r from-gray-50/80 via-white/80 to-gray-50/80 dark:from-gray-700/50 dark:via-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 dark:border-gray-600/50 mt-6">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                          💰 Детализация счета
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              Подытог:
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">₽{Number(order.subtotal).toFixed(2)}</span>
                          </div>
                          
                          {order.tax_amount > 0 && (
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                Налог:
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">₽{Number(order.tax_amount).toFixed(2)}</span>
                            </div>
                          )}
                          
                          {order.discount_amount > 0 && (
                            <div className="flex justify-between items-center py-2">
                              <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Скидка:
                              </span>
                              <span className="font-semibold text-green-600 dark:text-green-400">-₽{Number(order.discount_amount).toFixed(2)}</span>
                            </div>
                          )}
                          
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                                Итого:
                              </span>
                              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ₽{Number(order.total_amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                      {/* Временные метки */}
                      {(order.cooking_started_at || order.ready_at || order.served_at || order.paid_at) && (
                        <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-2xl p-5 border border-blue-200/50 dark:border-blue-700/50 mt-6">
                          <h5 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                            ⏰ Временная линия
                          </h5>
                          <div className="space-y-3">
                            {order.cooking_started_at && (
                              <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  👨‍🍳
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Начало готовки</div>
                                  <div className="text-xs text-blue-600 dark:text-blue-400">{new Date(order.cooking_started_at).toLocaleString('ru-RU')}</div>
                                </div>
                              </div>
                            )}
                            
                            {order.ready_at && (
                              <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                  ✅
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-green-800 dark:text-green-300">Готово</div>
                                  <div className="text-xs text-green-600 dark:text-green-400">{new Date(order.ready_at).toLocaleString('ru-RU')}</div>
                                </div>
                              </div>
                            )}
                            
                            {order.served_at && (
                              <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                  🍽️
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-purple-800 dark:text-purple-300">Подано</div>
                                  <div className="text-xs text-purple-600 dark:text-purple-400">{new Date(order.served_at).toLocaleString('ru-RU')}</div>
                                </div>
                              </div>
                            )}
                            
                            {order.paid_at && (
                              <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                  💰
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-green-800 dark:text-green-300">Оплачено</div>
                                  <div className="text-xs text-green-600 dark:text-green-400">{new Date(order.paid_at).toLocaleString('ru-RU')}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Краткая информация о позициях (когда свернуто) */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      !isOrderExpanded(order.id) ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>🍽️ Позиций: {order.orderItems?.length || 0}</span>
                          <span>💰 Сумма: ₽{calculateTotal(order)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {order.notes && (
                        <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-amber-50/80 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/20 backdrop-blur-sm rounded-2xl p-5 border border-amber-200/50 dark:border-amber-700/50 mt-6">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              📝
                            </div>
                            <div>
                              <h5 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
                                Примечания к заказу
                              </h5>
                              <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
                                {order.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Кнопки действий */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        {order.status === 'ready' && (
                          <Button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsPaymentModalOpen(true);
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>Обработать платеж</span>
                          </Button>
                        )}
                        
                        {order.status === 'pending' && (
                          <Button 
                            onClick={() => {
                              // TODO: Добавить логику изменения статуса на 'cooking'
                              console.log('Изменение статуса заказа на cooking:', order.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Начать готовить</span>
                          </Button>
                        )}
                        
                        {order.status === 'cooking' && (
                          <Button 
                            onClick={() => {
                              // TODO: Добавить логику изменения статуса на 'ready'
                              console.log('Изменение статуса заказа на ready:', order.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Готово</span>
                          </Button>
                        )}
                        
                        {/* Дополнительные кнопки */}
                        <Button 
                          variant="outline"
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Редактировать</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Модальное окно платежей */}
          <PaymentModal
            order={selectedOrder}
            isOpen={isPaymentModalOpen}
            onClose={() => {
              setIsPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            onPayment={handlePayment}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
