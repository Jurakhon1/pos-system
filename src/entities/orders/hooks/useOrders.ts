import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersApi } from "../api/ordersApi";
import { CreateOrder, CreateOrderFromCart } from "@/shared/types/orders";

export const useOrders = () => {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: OrdersApi.getOrders,
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrder) => OrdersApi.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const createOrderFromCartMutation = useMutation({
    mutationFn: (orderData: CreateOrderFromCart) => OrdersApi.createOrderFromCart(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      OrdersApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => OrdersApi.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, orderData }: { orderId: string; orderData: Partial<CreateOrder> }) =>
      OrdersApi.updateOrder(orderId, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const addOrderItemMutation = useMutation({
    mutationFn: ({ orderId, itemData }: { orderId: string; itemData: { menuItemId: string; quantity: number; specialInstructions?: string } }) =>
      OrdersApi.addOrderItem(orderId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const removeOrderItemMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
      OrdersApi.removeOrderItem(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateOrderItemMutation = useMutation({
    mutationFn: ({ orderId, itemId, itemData }: { orderId: string; itemId: string; itemData: { quantity?: number; specialInstructions?: string } }) =>
      OrdersApi.updateOrderItem(orderId, itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: ({ orderId, paymentData }: { orderId: string; paymentData: { paymentMethod: 'cash' | 'card' | 'mixed'; cashAmount?: number; cardAmount?: number; discountAmount?: number } }) =>
      OrdersApi.processPayment(orderId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    createOrder: createOrderMutation.mutate,
    createOrderFromCart: createOrderFromCartMutation.mutate,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    addOrderItem: addOrderItemMutation.mutate,
    removeOrderItem: removeOrderItemMutation.mutate,
    updateOrderItem: updateOrderItemMutation.mutate,
    processPayment: processPaymentMutation.mutate,
    isCreating: createOrderMutation.isPending,
    isCreatingFromCart: createOrderFromCartMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isAddingItem: addOrderItemMutation.isPending,
    isRemovingItem: removeOrderItemMutation.isPending,
    isUpdatingItem: updateOrderItemMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
  };
};

export const useOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => OrdersApi.getOrderById(orderId),
    enabled: !!orderId,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: (status: string) =>
      OrdersApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    order,
    isLoading,
    error,
    refetch,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
  };
};
