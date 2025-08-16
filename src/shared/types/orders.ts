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

export interface CreateOrder {
  cashierId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  total: number;
}

export interface CreateOrderFromCart {
  cashierId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  total?: number;
  table?: number; // Номер стола (заглушка)
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
