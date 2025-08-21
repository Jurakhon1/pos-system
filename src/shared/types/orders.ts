import { User } from "./auth";

// Новые типы для соответствия бэкенду
export interface Order {
  id: string;
  order_number: string;
  location_id: string;
  table_id?: string;
  order_type: 'dine_in' | 'takeaway';
  status: 'pending' | 'confirmed' | 'cooking' | 'ready' | 'served' | 'paid' | 'cancelled';
  waiter_id?: string;
  customer_name?: string;
  customer_phone?: string;
  guest_count: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method?: 'cash' | 'card' | 'mixed';
  cash_amount?: number;
  card_amount?: number;
  notes?: string;
  cooking_started_at?: Date;
  ready_at?: Date;
  served_at?: Date;
  paid_at?: Date;
  cancelled_at?: Date;
  created_at: Date;
  updated_at: Date;
  table?: {
    id: string;
    number: string;
    zone?: string;
  };
  waiter?: {
    id: string;
    name: string;
  };
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: 'pending' | 'cooking' | 'ready' | 'served' | 'cancelled';
  cook_id?: string;
  special_instructions?: string;
  cooking_started_at?: Date;
  ready_at?: Date;
  cooking_completed_at?: Date;
  created_at: Date;
  updated_at: Date;
  menuItem?: {
    id: string;
    name: string;
    description?: string;
    price: number;
  };
  cook?: {
    id: string;
    name: string;
  };
}

// Типы для платежей в соответствии с API спецификацией
export interface PaymentRequest {
  paymentMethod: 'cash' | 'card' | 'mixed';
  cashAmount?: number;      // Должно быть decimal (например: 460.00)
  cardAmount?: number;      // Должно быть decimal (например: 460.00)
  discountAmount: number;   // Всегда отправляется, даже если 0 (например: 0.00)
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  orderId: string;
  paymentId?: string;
  totalPaid: number;
  change?: number;
}

// Старые типы для обратной совместимости (можно удалить позже)
export interface Orders {
  id: number;
  status: "pending" | "in_progress" | "done" | "canceled";
  createdAt: string;
  items: OrderItem[];
  cashier: User;
  total?: number;
  table?: number; // Номер стола (заглушка)
}

export interface CreateOrder {
  locationId: string;
  tableId?: string;
  orderType: 'dine_in' | 'takeaway';
  waiterId?: string;
  customerName?: string;
  customerPhone?: string;
  guestCount?: number;
  notes?: string;
}

export interface CreateOrderFromCart extends CreateOrder {
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
}

// Дополнительные типы для работы с заказами
export interface OrderStatus {
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  {
    value: "pending",
    label: "Ожидает",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100"
  },
  {
    value: "confirmed",
    label: "Подтвержден",
    color: "text-blue-800",
    bgColor: "bg-blue-100"
  },
  {
    value: "cooking",
    label: "Готовится",
    color: "text-orange-800",
    bgColor: "bg-orange-100"
  },
  {
    value: "ready",
    label: "Готов",
    color: "text-green-800",
    bgColor: "bg-green-100"
  },
  {
    value: "served",
    label: "Подано",
    color: "text-purple-800",
    bgColor: "bg-purple-100"
  },
  {
    value: "paid",
    label: "Оплачен",
    color: "text-gray-800",
    bgColor: "bg-gray-100"
  },
  {
    value: "cancelled",
    label: "Отменен",
    color: "text-red-800",
    bgColor: "bg-red-100"
  }
];
