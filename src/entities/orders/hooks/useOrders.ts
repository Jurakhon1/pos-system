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
    mutationFn: ({ orderId, status }: { orderId: string; status: "pending" | "in_progress" | "done" | "canceled" }) =>
      OrdersApi.updateOrderStatus(orderId, status),
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
    isCreating: createOrderMutation.isPending,
    isCreatingFromCart: createOrderFromCartMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
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
    mutationFn: (status: "pending" | "in_progress" | "done" | "canceled") =>
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
