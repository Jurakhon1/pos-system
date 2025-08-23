export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  number: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  discountAmount?: string;
  cashAmount?: string;
  cardAmount?: string;
}

export type OrderStatus = 
  | 'pending'      // Ожидает подтверждения
  | 'confirmed'    // Подтвержден
  | 'preparing'    // Готовится
  | 'ready'        // Готов к выдаче
  | 'delivered'    // Доставлен
  | 'cancelled';   // Отменен

export type PaymentMethod = 
  | 'cash'         // Наличные
  | 'card'         // Банковская карта
  | 'qr'           // QR-код
  | 'online';      // Онлайн оплата

export type PaymentStatus = 
  | 'pending'      // Ожидает оплаты
  | 'paid'         // Оплачен
  | 'failed'       // Ошибка оплаты
  | 'refunded';    // Возврат

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  estimatedDeliveryTime?: Date;
  notes?: string;
}
