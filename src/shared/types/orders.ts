import { User } from "./auth";

export interface Orders {
  id: number;
  status: "pending" | "in_progress" | "done" | "canceled";
  createdAt: string;
  items: OrderItem[];
  cashier: User;
  total?: number;
  table?: number; // Номер стола (заглушка)
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string | number;
    imageUrl?: string;
  };
  quantity: number;
  price: string | number;
}

// Обновленные типы для соответствия бэкенду
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

export interface CreateOrderFromCart {
  locationId: string;
  tableId?: string;
  orderType: 'dine_in' | 'takeaway';
  waiterId?: string;
  customerName?: string;
  customerPhone?: string;
  guestCount?: number;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
}

// Дополнительные типы для работы с заказами
export interface OrderStatus {
  value: "pending" | "in_progress" | "done" | "canceled";
  label: string;
  color: string;
  bgColor: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  {
    value: "pending",
    label: "В ожидании",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    value: "in_progress",
    label: "В работе",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    value: "done",
    label: "Завершен",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    value: "canceled",
    label: "Отменен",
    color: "text-red-600",
    bgColor: "bg-red-100"
  }
];
