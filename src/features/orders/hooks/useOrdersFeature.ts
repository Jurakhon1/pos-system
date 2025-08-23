import { useState, useMemo, useCallback } from "react";
import { Order, PaymentRequest } from "@/shared/types/orders";
import { useOrders } from "@/entities/orders/hooks/useOrders";
import { FileText, Clock, User, CheckCircle } from "lucide-react";

export const useOrdersFeature = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  // Calculate stats with useMemo to prevent unnecessary recalculations
  const stats = useMemo(() => [
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
  ], [orders]);

  // Фильтрация заказов
  const filteredOrders = useMemo(() => orders?.filter((order: Order) => {
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
  }) || [], [orders, searchTerm, statusFilter, dateFilter]);

  const handlePaymentClick = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  }, []);

  const handlePaymentClose = useCallback(() => {
    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
  }, []);

  const handlePayment = useCallback(async (paymentData: PaymentRequest) => {
    if (!selectedOrder) return;

    try {
      await processPayment({ orderId: selectedOrder.id, paymentData });
      console.log('Payment processed successfully');
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Handle specific API errors
      if (error.response?.data?.message) {
        console.error('API Error Details:', error.response.data);
        alert(`Ошибка платежа: ${error.response.data.message}`);
      } else {
        alert('Произошла ошибка при обработке платежа');
      }
      throw error; // Re-throw to let the modal handle it
    }
  }, [selectedOrder, processPayment]);

  const handleStatusUpdate = useCallback(async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      console.log(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Status update error:', error);
    }
  }, [updateOrderStatus]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleDateFilterChange = useCallback((value: string) => {
    setDateFilter(value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  }, []);

  return {
    // State
    searchTerm,
    statusFilter,
    dateFilter,
    selectedOrder,
    isPaymentModalOpen,
    
    // Data
    orders,
    filteredOrders,
    stats,
    isLoading,
    error,
    isProcessingPayment,
    isUpdatingStatus,
    
    // Actions
    refetch,
    handlePaymentClick,
    handlePaymentClose,
    handlePayment,
    handleStatusUpdate,
    handleSearchChange,
    handleStatusFilterChange,
    handleDateFilterChange,
    handleResetFilters
  };
};
