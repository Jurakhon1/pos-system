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
    // Сначала создаем заказ
    const orderResponse = await api.post(`/orders`, {
      locationId: orderData.locationId,
      tableId: orderData.tableId,
      orderType: orderData.orderType,
      waiterId: orderData.waiterId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      guestCount: orderData.guestCount || 1,
      notes: orderData.notes
    });
    
    const order = orderResponse.data;
    
    // Затем добавляем позиции заказа
    if (orderData.items && orderData.items.length > 0) {
      for (const item of orderData.items) {
        await api.post(`/orders/${order.id}/items`, {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        });
      }
    }
    
    return order;
  },
  addOrderItem: async (orderId: string, itemData: { menuItemId: string; quantity: number; specialInstructions?: string }) => {
    const response = await api.post(`/orders/${orderId}/items`, itemData);
    return response.data;
  },
  updateOrderStatus: async (
    orderId: string,
    orderStatus: "pending" | "in_progress" | "done" | "canceled"
  ) => {
    const response = await api.put(`/orders/${orderId}/status`, orderStatus);
    return response.data;
  },
  processPayment: async (orderId: string, paymentData: { paymentMethod: 'cash' | 'card' | 'mixed'; cashAmount?: number; cardAmount?: number; discountAmount?: number }) => {
    const response = await api.post(`/orders/${orderId}/payment`, paymentData);
    return response.data;
  },
};
