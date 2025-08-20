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
  // New methods for getting orders by status and location
  getPendingOrders: async (locationId: string) => {
    const response = await api.get(`/orders/pending/${locationId}`);
    return response.data;
  },
  getCookingOrders: async (locationId: string) => {
    const response = await api.get(`/orders/cooking/${locationId}`);
    return response.data;
  },
  getReadyOrders: async (locationId: string) => {
    const response = await api.get(`/orders/ready/${locationId}`);
    return response.data;
  },
  getOrdersByTable: async (tableId: string) => {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
  },
  getOrdersByWaiter: async (waiterId: string) => {
    const response = await api.get(`/orders/waiter/${waiterId}`);
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
  processPayment: async (orderId: string, paymentData: { paymentMethod: 'cash' | 'card' | 'mixed'; cashAmount?: number; cardAmount?: number; discountAmount?: number }) => {
    const response = await api.post(`/orders/${orderId}/payment`, paymentData);
    return response.data;
  },
  deleteOrder: async (orderId: string) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
  updateOrder: async (orderId: string, orderData: Partial<CreateOrder>) => {
    const response = await api.patch(`/orders/${orderId}`, orderData);
    return response.data;
  },
  addOrderItem: async (orderId: string, itemData: { menuItemId: string; quantity: number; specialInstructions?: string }) => {
    const response = await api.post(`/orders/${orderId}/items`, itemData);
    return response.data;
  },
  removeOrderItem: async (orderId: string, itemId: string) => {
    const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  },
  updateOrderItem: async (orderId: string, itemId: string, itemData: { quantity?: number; specialInstructions?: string }) => {
    const response = await api.put(`/orders/${orderId}/items/${itemId}`, itemData);
    return response.data;
  },
  // Kitchen management methods
  startCookingOrderItem: async (orderId: string, itemId: string, cookId?: string) => {
    // Backend requires cook_id, use default if not provided
    const defaultCookId = cookId || 'default-cook-id'; // В реальном приложении это должно быть ID текущего повара
    const response = await api.put(`/orders/${orderId}/items/${itemId}/start-cooking`, { 
      cook_id: defaultCookId 
    });
    return response.data;
  },
  markOrderItemReady: async (orderId: string, itemId: string) => {
    const response = await api.put(`/orders/${orderId}/items/${itemId}/ready`);
    return response.data;
  },
  updateOrderItemQuantity: async (orderId: string, itemId: string, quantity: number) => {
    const response = await api.patch(`/orders/${orderId}/items/${itemId}/quantity`, { quantity });
    return response.data;
  },
  cancelOrder: async (orderId: string) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  }
};
