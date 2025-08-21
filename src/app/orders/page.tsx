"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { 
  Search, 
  Clock, 
  User, 
  ShoppingCart,
  Eye,
  Trash2,
  Plus,
  Table,
  Phone,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  CreditCard,
  DollarSign,
  Filter
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { Order, OrderItem, ORDER_STATUSES, PaymentRequest } from "@/shared/types/orders";
import { ToastContainer, ToastProps } from "@/shared/ui/toast";

// Модальное окно для обработки платежей
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Обработка платежа</h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Заказ #{order.order_number}</p>
            <p className="text-base sm:text-lg font-bold text-green-600">Сумма: ₽{totalAmount.toFixed(2)}</p>
          </div>

          {/* Способ оплаты */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Способ оплаты</label>
            <div className="space-y-2">
              <label className="flex items-center text-sm sm:text-base">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                  className="mr-2"
                />
                <DollarSign className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                <span className="truncate">Наличные</span>
              </label>
              <label className="flex items-center text-sm sm:text-base">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  className="mr-2"
                />
                <CreditCard className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span className="truncate">Карта</span>
              </label>
              <label className="flex items-center text-sm sm:text-base">
                <input
                  type="radio"
                  value="mixed"
                  checked={paymentMethod === 'mixed'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'mixed')}
                  className="mr-2"
                />
                <div className="flex items-center mr-2 flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <CreditCard className="w-4 h-4 text-blue-600 -ml-1" />
                </div>
                <span className="truncate">Смешанная оплата</span>
              </label>
            </div>
          </div>

          {/* Скидка */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Скидка (₽)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              min="0"
              max={totalAmount}
              step="0.01"
            />
          </div>

          {/* Суммы по способам оплаты */}
          {paymentMethod === 'cash' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сумма наличными</label>
              <Input
                type="number"
                placeholder={finalTotal.toFixed(2)}
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сумма картой</label>
              <Input
                type="number"
                placeholder={finalTotal.toFixed(2)}
                value={cardAmount}
                onChange={(e) => setCardAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          )}

          {paymentMethod === 'mixed' && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сумма наличными</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сумма картой</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* Итоговая сумма */}
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <div className="flex justify-between text-sm">
              <span>Итого к оплате:</span>
              <span className="font-bold text-green-600">₽{finalTotal.toFixed(2)}</span>
            </div>
            {paymentMethod === 'mixed' && (
              <div className="text-xs text-gray-500 mt-1">
                Наличные: ₽{Number(cashAmount) || 0} | Карта: ₽{Number(cardAmount) || 0}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <span className="text-sm sm:text-base">Отмена</span>
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!canSubmit()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base">Оплатить</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Модальное окно для просмотра заказа
const OrderViewModal = ({ order, isOpen, onClose }: { order: Order | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Заказ #{order.order_number}</h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Информация о заказе */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Основная информация</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className="font-medium">{ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Тип заказа:</span>
                    <span className="font-medium">{order.order_type === 'dine_in' ? 'В ресторане' : 'На вынос'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата создания:</span>
                    <span className="font-medium">{new Date(order.created_at).toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Общая сумма:</span>
                    <span className="font-bold text-green-600">₽{Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {order.customer_name && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Информация о клиенте</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Имя:</span>
                      <span className="font-medium">{order.customer_name}</span>
                    </div>
                    {order.customer_phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Телефон:</span>
                        <span className="font-medium">{order.customer_phone}</span>
                      </div>
                    )}
                    {order.guest_count && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Количество гостей:</span>
                        <span className="font-medium">{order.guest_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {order.table && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Информация о столе</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Номер стола:</span>
                      <span className="font-medium">{order.table.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Зона:</span>
                      <span className="font-medium">{order.table.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Вместимость:</span>
                      <span className="font-medium">{order.guest_count} чел.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Товары заказа */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Товары заказа</h3>
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div className="space-y-3">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.menuItem?.name}</h4>
                            <p className="text-sm text-gray-600">{item.menuItem?.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-600">Количество: {item.quantity}</span>
                              <span className="text-gray-600">Цена: ₽{Number(item.total_price).toFixed(2)}</span>
                              <span className="font-medium text-green-600">
                                Итого: ₽{(Number(item.total_price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            {item.special_instructions && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                                💬 {item.special_instructions}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Товары не добавлены</p>
                )}
              </div>

              {order.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Примечания</h3>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Модальное окно для изменения статуса
const StatusChangeModal = ({ order, isOpen, onClose, onStatusChange }: { 
  order: Order | null; 
  isOpen: boolean; 
  onClose: () => void;
  onStatusChange: (orderId: string, status: string) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  if (!isOpen || !order) return null;

  const handleSubmit = () => {
    if (selectedStatus) {
      onStatusChange(order.id, selectedStatus);
      onClose();
      setSelectedStatus("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Изменить статус заказа</h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Заказ #{order.order_number}</p>
            <p className="text-xs sm:text-sm text-gray-500">Текущий статус: {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Новый статус</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="">Выберите статус</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <span className="text-sm sm:text-base">Отмена</span>
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedStatus}
              className="flex-1"
            >
              <span className="text-sm sm:text-base">Изменить статус</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Модальное окно для подтверждения удаления
const DeleteConfirmModal = ({ order, isOpen, onClose, onDelete }: { 
  order: Order | null; 
  isOpen: boolean; 
  onClose: () => void;
  onDelete: (orderId: string) => void;
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Удалить заказ</h2>
          </div>
          
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Вы уверены, что хотите удалить заказ #{order.order_number}? 
            Это действие нельзя отменить.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <span className="text-sm sm:text-base">Отмена</span>
            </Button>
            <Button 
              onClick={() => onDelete(order.id)} 
              variant="destructive"
              className="flex-1"
            >
              <span className="text-sm sm:text-base">Удалить</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const { 
    orders, 
    isLoading, 
    error, 
    updateOrderStatus, 
    deleteOrder,
    isUpdatingStatus,
    isDeleting,
    processPayment,
    cancelOrder,
    isProcessingPayment,
    isCancelling
  } = useOrders();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "status" | "total">("date");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Модальные окна
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });
  
  // Уведомления
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Фильтрация заказов
  const filteredOrders = orders?.filter((order: Order) => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone?.includes(searchQuery) ||
      order.table?.number?.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Сортировка заказов
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "status":
        return a.status.localeCompare(b.status);
      case "total":
        return Number(b.total_amount) - Number(a.total_amount);
      default:
        return 0;
    }
  });

  // Получение статуса заказа
  const getOrderStatus = (status: string) => {
    return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
  };

  // Форматирование даты
  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Обработчики действий
  const handleStatusChange = (orderId: string, status: string) => {
    updateOrderStatus({ orderId, status });
    
    // Показываем уведомление об изменении статуса
    const statusLabel = ORDER_STATUSES.find(s => s.value === status)?.label || status;
    addToast({
      type: 'info',
      title: 'Статус изменен',
      message: `Статус заказа изменен на "${statusLabel}"`,
      duration: 3000,
      onClose: removeToast
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId);
    setDeleteModal({ isOpen: false, order: null });
  };

  const handlePayOrder = (orderId: string, paymentData: PaymentRequest) => {
    processPayment({ orderId, paymentData });
    setPaymentModal({ isOpen: false, order: null });
    
    // Показываем уведомление об успешной обработке платежа
    const order = orders?.find((o: Order) => o.id === orderId);
    addToast({
      type: 'success',
      title: 'Платеж обработан',
      message: `Заказ #${order?.order_number} успешно оплачен`,
      duration: 4000,
      onClose: removeToast
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Вы уверены, что хотите отменить этот заказ?')) {
      cancelOrder(orderId);
    }
  };

  // Функции для работы с уведомлениями
  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
          <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">Ошибка загрузки заказов: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Заказы</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Управление заказами и их статусами
              </p>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => window.location.href = '/pos'}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый заказ
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="border-border bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск по номеру заказа, клиенту, телефону или столу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-2 min-w-[140px]">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full bg-background text-foreground"
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
              <div className="flex items-center gap-2 min-w-[140px]">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Сортировка:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "status" | "total")}
                  className="border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full bg-background text-foreground"
                >
                  <option value="date">По дате</option>
                  <option value="status">По статусу</option>
                  <option value="total">По сумме</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">Вид:</span>
                <div className="flex border border-border rounded-md overflow-hidden bg-background">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none border-0 h-8 px-3"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none border-0 h-8 px-3"
                  >
                    <Table className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика заказов */}
      {sortedOrders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Всего заказов</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{sortedOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Активные</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">
                    {sortedOrders.filter(order => !['paid', 'cancelled'].includes(order.status)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-950/20 rounded-lg flex-shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Ожидают</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">
                    {sortedOrders.filter(order => order.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-950/20 rounded-lg flex-shrink-0">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Общая сумма</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
                    ₽{sortedOrders.reduce((sum: number, order: Order) => sum + Number(order.total_amount), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {sortedOrders.length === 0 ? (
          <Card className={`${viewMode === "grid" ? "md:col-span-full" : ""} border-border bg-card/80 backdrop-blur-sm`}>
            <CardContent className="p-6 md:p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Заказы не найдены</p>
              <p className="text-muted-foreground/70">Попробуйте изменить параметры поиска</p>
            </CardContent>
          </Card>
        ) : (
          sortedOrders.map((order) => {
            const status = getOrderStatus(order.status);
            const isExpanded = expandedOrders.has(order.id);
            
            // Разный рендеринг для списка и сетки
            if (viewMode === "grid") {
              return (
                <Card key={order.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3">
                      {/* Заголовок заказа */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">#</span>
                          <span className="font-bold text-lg text-foreground">{order.order_number}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </div>
                      </div>
                      
                      {/* Тип заказа */}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                          {order.order_type === 'dine_in' ? '🍽️ В ресторане' : '🚀 На вынос'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Основная информация */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate text-xs">{formatOrderDate(order.created_at)}</span>
                      </div>
                      
                      {order.customer_name && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate text-xs">{order.customer_name}</span>
                        </div>
                      )}
                      
                      {order.table && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Table className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate text-xs">Стол {order.table.number}</span>
                        </div>
                      )}
                      
                      <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        ₽{Number(order.total_amount).toFixed(2)}
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="h-7 px-2 text-xs border-border hover:bg-muted/50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {isExpanded ? 'Скрыть' : 'Детали'}
                      </Button>
                      
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className="h-7 px-2 text-xs border border-border rounded focus:ring-1 focus:ring-blue-500 bg-background text-foreground"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      
                      {order.status !== 'paid' && order.status !== 'cancelled' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-2 text-xs text-green-600 dark:text-green-400 border-green-300 hover:bg-green-50 dark:hover:bg-green-950/20"
                          onClick={() => setPaymentModal({ isOpen: true, order })}
                          disabled={isProcessingPayment}
                        >
                          <CreditCard className="w-3 h-3" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 text-xs text-red-600 dark:text-red-400 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setDeleteModal({ isOpen: true, order })}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Развернутые товары */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-border">
                        <h4 className="font-medium text-foreground mb-2 text-sm">Товары:</h4>
                        {order.orderItems && order.orderItems.length > 0 ? (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {order.orderItems.map((item: OrderItem) => (
                              <div key={item.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground truncate">{item.menuItem?.name || 'Неизвестный товар'}</p>
                                  <p className="text-muted-foreground">
                                    ₽{Number(item.unit_price).toFixed(2)} × {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <p className="font-medium text-foreground">
                                    ₽{(Number(item.unit_price) * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-2 text-muted-foreground text-xs">
                            <ShoppingCart className="w-4 h-4 mx-auto mb-1" />
                            <p>Товары не добавлены</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            }
            
            // Обычный режим списка
            return (
              <Card key={order.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Заказ #</span>
                        <span className="font-bold text-lg text-foreground">{order.order_number}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color} w-fit`}>
                        {status.label}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-muted/50 rounded text-xs">
                          {order.order_type === 'dine_in' ? '🍽️ В ресторане' : '🚀 На вынос'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-xs sm:text-sm border-border hover:bg-muted/50"
                      >
                        {isExpanded ? (
                          <>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Скрыть</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Детали</span>
                          </>
                        )}
                      </Button>
                      
                      {/* Быстрый селектор статуса */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-background text-foreground ${
                          isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
                        }`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      
                      {/* Кнопка оплаты */}
                      {order.status !== 'paid' && order.status !== 'cancelled' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border-green-300 text-xs sm:text-sm hover:bg-green-50 dark:hover:bg-green-950/20"
                          onClick={() => setPaymentModal({ isOpen: true, order })}
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                          ) : (
                            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          )}
                          <span className="hidden sm:inline">Оплатить</span>
                        </Button>
                      )}
                      
                      {/* Кнопка отмены */}
                      {order.status !== 'cancelled' && order.status !== 'paid' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-red-300 text-xs sm:text-sm hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isCancelling}
                        >
                          {isCancelling ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                          ) : (
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          )}
                          <span className="hidden sm:inline">Отменить</span>
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs sm:text-sm border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setDeleteModal({ isOpen: true, order })}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">Удалить</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Order Info */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{formatOrderDate(order.created_at)}</span>
                      </div>
                      
                      {order.customer_name && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Клиент: {order.customer_name}</span>
                        </div>
                      )}
                      
                      {order.customer_phone && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{order.customer_phone}</span>
                        </div>
                      )}
                      
                      {order.guest_count && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Гостей: {order.guest_count}</span>
                        </div>
                      )}
                      
                      {order.table && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Table className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Стол {order.table.number} ({order.table.zone})</span>
                        </div>
                      )}
                      
                      <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                        Итого: ₽{Number(order.total_amount).toFixed(2)}
                      </div>
                    </div>

                    {/* Items - показываем только если развернуто */}
                    {isExpanded ? (
                      <div className="lg:col-span-2">
                        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">Товары:</h4>
                        {order.orderItems && order.orderItems.length > 0 ? (
                          <div className="space-y-2">
                            {order.orderItems.map((item: OrderItem) => (
                              <div key={item.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-foreground text-sm sm:text-base truncate">{item.menuItem?.name || 'Неизвестный товар'}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      ₽{Number(item.unit_price).toFixed(2)} × {item.quantity}
                                    </p>
                                    {item.special_instructions && (
                                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 truncate">
                                        💬 {item.special_instructions}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="font-medium text-foreground text-sm sm:text-base">
                                    ₽{(Number(item.unit_price) * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm">Товары не добавлены</p>
                          </div>
                        )}
                        
                        {order.notes && (
                          <div className="mt-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                              <strong>Примечания:</strong> {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="lg:col-span-2 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <ShoppingCart className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs sm:text-sm">Нажмите &quot;Детали&quot; для просмотра товаров</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary */}
      {sortedOrders.length > 0 && (
        <Card className="border-border bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
              <span>Показано заказов: {sortedOrders.length}</span>
              <span className="font-medium">
                Общая сумма: ₽{sortedOrders.reduce((sum: number, order: Order) => sum + Number(order.total_amount), 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Модальные окна */}
      <OrderViewModal
        order={viewModal.order}
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, order: null })}
      />
      
      <StatusChangeModal
        order={statusModal.order}
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, order: null })}
        onStatusChange={handleStatusChange}
      />
      
      <DeleteConfirmModal
        order={deleteModal.order}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, order: null })}
        onDelete={handleDeleteOrder}
      />

      <PaymentModal
        order={paymentModal.order}
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, order: null })}
        onPayment={handlePayOrder}
      />

      {/* Уведомления */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
