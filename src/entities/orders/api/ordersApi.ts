import api from "@/shared/api/axios";
import { CreateOrder, CreateOrderFromCart } from "@/shared/types/orders";

export const OrdersApi = {
  getOrders: async () => {
    const response = await api.get(`/orders`);
    return response.data;
  },
  getOrderById: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  createOrder: async (orderData: CreateOrder) => {
    const response = await api.post(`/orders`, orderData);
    return response.data;
  },
  createOrderFromCart: async (orderData: CreateOrderFromCart) => {
    const response = await api.post(`/orders`, orderData);
    return response.data;
  },
  updateOrderStatus: async (
    orderId: string,
    orderStatus: "pending" | "in_progress" | "done" | "canceled"
  ) => {
    const response = await api.put(`/orders/${orderId}/status`, orderStatus);
    return response.data;
  },
};
