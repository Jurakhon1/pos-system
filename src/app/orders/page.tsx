"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Table,
  Phone,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { Order, OrderItem, ORDER_STATUSES } from "@/shared/types/orders";
import { formatDate } from "@/shared/lib/utils";

// Модальное окно для просмотра заказа
const OrderViewModal = ({ order, isOpen, onClose }: { order: Order | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Заказ #{order.order_number}</h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <span className="font-medium">{order.table.capacity} чел.</span>
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
                            <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                            <p className="text-sm text-gray-600">{item.menuItem.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-600">Количество: {item.quantity}</span>
                              <span className="text-gray-600">Цена: ₽{Number(item.price).toFixed(2)}</span>
                              <span className="font-medium text-green-600">
                                Итого: ₽{(Number(item.price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            {item.specialInstructions && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                                💬 {item.specialInstructions}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Изменить статус заказа</h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Заказ #{order.order_number}</p>
            <p className="text-sm text-gray-500">Текущий статус: {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Новый статус</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите статус</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedStatus}
              className="flex-1"
            >
              Изменить статус
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Удалить заказ</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Вы уверены, что хотите удалить заказ #{order.order_number}? 
            Это действие нельзя отменить.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button 
              onClick={() => onDelete(order.id)} 
              variant="destructive"
              className="flex-1"
            >
              Удалить
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
    isDeleting
  } = useOrders();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "status" | "total">("date");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  // Модальные окна
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });

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
  };

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId);
    setDeleteModal({ isOpen: false, order: null });
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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Ошибка загрузки заказов: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-600 mt-2">
            Управление заказами и их статусами
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/pos'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый заказ
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по номеру заказа, клиенту, телефону или столу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "status" | "total")}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">По дате</option>
                <option value="status">По статусу</option>
                <option value="total">По сумме</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика заказов */}
      {sortedOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Всего заказов</p>
                  <p className="text-2xl font-bold text-gray-900">{sortedOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Активные</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sortedOrders.filter(order => !['paid', 'cancelled'].includes(order.status)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ожидают</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sortedOrders.filter(order => order.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Общая сумма</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₽{sortedOrders.reduce((sum: number, order: Order) => sum + Number(order.total_amount), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Заказы не найдены</p>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </CardContent>
          </Card>
        ) : (
          sortedOrders.map((order) => {
            const status = getOrderStatus(order.status);
            const isExpanded = expandedOrders.has(order.id);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Заказ #</span>
                        <span className="font-bold text-lg">{order.order_number}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {order.order_type === 'dine_in' ? '🍽️ В ресторане' : '🚀 На вынос'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        {isExpanded ? (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Скрыть
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Детали
                          </>
                        )}
                      </Button>
                      
                      {/* Быстрый селектор статуса */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className={`px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
                        }`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setDeleteModal({ isOpen: true, order })}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatOrderDate(order.created_at)}</span>
                      </div>
                      
                      {order.customer_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Клиент: {order.customer_name}</span>
                        </div>
                      )}
                      
                      {order.customer_phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{order.customer_phone}</span>
                        </div>
                      )}
                      
                      {order.guest_count && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Гостей: {order.guest_count}</span>
                        </div>
                      )}
                      
                      {order.table && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Table className="w-4 h-4" />
                          <span>Стол {order.table.number} ({order.table.zone})</span>
                        </div>
                      )}
                      
                      <div className="text-lg font-bold text-green-600">
                        Итого: ₽{Number(order.total_amount).toFixed(2)}
                      </div>
                    </div>

                    {/* Items - показываем только если развернуто */}
                    {isExpanded ? (
                      <div className="lg:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-3">Товары:</h4>
                        {order.orderItems && order.orderItems.length > 0 ? (
                          <div className="space-y-2">
                            {order.orderItems.map((item: OrderItem) => (
                              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                    {item.menuItem.imageUrl ? (
                                      <img
                                        src={item.menuItem.imageUrl}
                                        alt={item.menuItem.name}
                                        className="w-full h-full object-cover rounded-md"
                                      />
                                    ) : (
                                      <ShoppingCart className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                                    <p className="text-sm text-gray-500">
                                      ₽{Number(item.price).toFixed(2)} × {item.quantity}
                                    </p>
                                    {item.specialInstructions && (
                                      <p className="text-xs text-blue-600 mt-1">
                                        💬 {item.specialInstructions}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                                    ₽{(Number(item.price) * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>Товары не добавлены</p>
                          </div>
                        )}
                        
                        {order.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Примечания:</strong> {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="lg:col-span-2 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Нажмите "Детали" для просмотра товаров</p>
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Показано заказов: {sortedOrders.length}</span>
              <span>
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
    </div>
  );
}
