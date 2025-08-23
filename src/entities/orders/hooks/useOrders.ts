"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { OrdersApi } from "../api/ordersApi";
import { CreateOrder, CreateOrderFromCart, PaymentRequest } from "@/shared/types/orders";

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

  // Kitchen-specific queries
  const usePendingOrders = (locationId: string) => useQuery({
    queryKey: ["orders", "pending", locationId],
    queryFn: () => OrdersApi.getPendingOrders(locationId),
    enabled: !!locationId,
  });

  const useCookingOrders = (locationId: string) => useQuery({
    queryKey: ["orders", "cooking", locationId],
    queryFn: () => OrdersApi.getCookingOrders(locationId),
    enabled: !!locationId,
  });

  const useReadyOrders = (locationId: string) => useQuery({
    queryKey: ["orders", "ready", locationId],
    queryFn: () => OrdersApi.getReadyOrders(locationId),
    enabled: !!locationId,
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
    mutationFn: ({ orderId, paymentData }: { orderId: string; paymentData: PaymentRequest }) =>
      OrdersApi.processPayment(orderId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // Kitchen mutations
  const startCookingOrderItemMutation = useMutation({
    mutationFn: ({ orderId, itemId, cookId }: { orderId: string; itemId: string; cookId?: string }) =>
      OrdersApi.startCookingOrderItem(orderId, itemId, cookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const markOrderItemReadyMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
      OrdersApi.markOrderItemReady(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => OrdersApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // Wrap mutation functions in useCallback to prevent infinite re-renders
  const createOrder = useCallback(createOrderMutation.mutate, [createOrderMutation.mutate]);
  const createOrderFromCart = useCallback(createOrderFromCartMutation.mutate, [createOrderFromCartMutation.mutate]);
  const updateOrderStatus = useCallback(updateOrderStatusMutation.mutate, [updateOrderStatusMutation.mutate]);
  const deleteOrder = useCallback(deleteOrderMutation.mutate, [deleteOrderMutation.mutate]);
  const updateOrder = useCallback(updateOrderMutation.mutate, [updateOrderMutation.mutate]);
  const addOrderItem = useCallback(addOrderItemMutation.mutate, [addOrderItemMutation.mutate]);
  const removeOrderItem = useCallback(removeOrderItemMutation.mutate, [removeOrderItemMutation.mutate]);
  const updateOrderItem = useCallback(updateOrderItemMutation.mutate, [updateOrderItemMutation.mutate]);
  const processPayment = useCallback(processPaymentMutation.mutate, [processPaymentMutation.mutate]);
  const startCookingOrderItem = useCallback(startCookingOrderItemMutation.mutate, [startCookingOrderItemMutation.mutate]);
  const markOrderItemReady = useCallback(markOrderItemReadyMutation.mutate, [markOrderItemReadyMutation.mutate]);
  const cancelOrder = useCallback(cancelOrderMutation.mutate, [cancelOrderMutation.mutate]);

  return {
    orders,
    isLoading,
    error,
    refetch,
    // Kitchen queries
    usePendingOrders,
    useCookingOrders,
    useReadyOrders,
    // Mutations
    createOrder,
    createOrderFromCart,
    updateOrderStatus,
    deleteOrder,
    updateOrder,
    addOrderItem,
    removeOrderItem,
    updateOrderItem,
    processPayment,
    startCookingOrderItem,
    markOrderItemReady,
    cancelOrder,
    // Loading states
    isCreating: createOrderMutation.isPending,
    isCreatingFromCart: createOrderFromCartMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isAddingItem: addOrderItemMutation.isPending,
    isRemovingItem: removeOrderItemMutation.isPending,
    isUpdatingItem: updateOrderItemMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
    isStartingCooking: startCookingOrderItemMutation.isPending,
    isMarkingReady: markOrderItemReadyMutation.isPending,
    isCancelling: cancelOrderMutation.isPending,
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

  // Wrap mutation function in useCallback to prevent infinite re-renders
  const updateOrderStatus = useCallback(updateOrderStatusMutation.mutate, [updateOrderStatusMutation.mutate]);

  return {
    order,
    isLoading,
    error,
    refetch,
    updateOrderStatus,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
  };
};
