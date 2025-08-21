"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
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
  Filter,
<<<<<<< HEAD
  Calendar
=======
  Calendar,
  TableIcon
>>>>>>> da7ff35f5700d0df922fac379a4fcb07c697e2ba
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { Order, OrderItem, ORDER_STATUSES, PaymentRequest } from "@/shared/types/orders";
import { ToastContainer, ToastProps } from "@/shared/ui/toast";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

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
            <p className="text-xs sm:text-sm text-gray-500">Сумма: ₽{totalAmount.toFixed(2)}</p>
          </div>

          {/* Метод оплаты */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Метод оплаты</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'mixed')}
                  className="mr-2"
                />
                <span className="text-sm">Наличные</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'mixed')}
                  className="mr-2"
                />
                <span className="text-sm">Банковская карта</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="mixed"
                  checked={paymentMethod === 'mixed'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'mixed')}
                  className="mr-2"
                />
                <span className="text-sm">Смешанная оплата</span>
              </label>
            </div>
          </div>

          {/* Скидка */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Скидка (₽)</label>
            <input
              type="number"
              placeholder="0.00"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              min="0"
              max={totalAmount}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Поля для ввода сумм в зависимости от метода */}
          {paymentMethod === 'cash' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сумма наличными</label>
              <input
                type="number"
                placeholder={finalTotal.toFixed(2)}
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сумма картой</label>
              <input
                type="number"
                placeholder={finalTotal.toFixed(2)}
                value={cardAmount}
                onChange={(e) => setCardAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {paymentMethod === 'mixed' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сумма наличными</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сумма картой</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {/* Итоговая сумма */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Итого к оплате:</span>
              <span className="font-bold text-green-600">₽{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!canSubmit()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Обработать платеж
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // Здесь будет вызов API для получения заказов
      // Пока используем моковые данные
      const mockOrders: Order[] = [
        {
          id: '1',
          order_number: '1234',
<<<<<<< HEAD
          location_id: '1',
          status: 'pending',
          order_type: 'dine_in',
          guest_count: 2,
          subtotal: 1250.00,
          tax_amount: 0,
          discount_amount: 0,
          total_amount: 1250.00,
          created_at: new Date(),
          updated_at: new Date(),
          customer_name: 'Иван Иванов',
          customer_phone: '+7 (999) 123-45-67',
          table: {
            id: '1',
            number: '5'
          },
          notes: 'Без лука',
          orderItems: [
            {
              id: '1',
              order_id: '1',
              menu_item_id: '1',
              quantity: 1,
              unit_price: 1250.00,
              total_price: 1250.00,
              status: 'pending',
              created_at: new Date(),
              updated_at: new Date(),
              menuItem: {
                id: '1',
                name: 'Пицца Маргарита',
                price: 1250.00
              }
            }
          ]
=======
          status: 'pending',
          total_amount: '1250.00',
          created_at: new Date().toISOString(),
          customer_name: 'Иван Иванов',
          customer_phone: '+7 (999) 123-45-67',
          table_number: '5',
          order_type: 'dine_in',
          guest_count: 2,
          notes: 'Без лука'
>>>>>>> da7ff35f5700d0df922fac379a4fcb07c697e2ba
        }
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } catch (err) {
      setError('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
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
                <option value="ready">Готов</option>
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
                            {order.table && (
                              <span className="flex items-center gap-1">
                                <Table className="w-4 h-4" />
                                Стол {order.table.number}
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
                              x{item.quantity} • {item.unit_price} ₽
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {(item.unit_price || 0) * (item.quantity || 1)} ₽
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
