export interface CartItem {
  id: number | string;
  name: string;
  price: string | number;
  quantity: number;
  imageUrl?: string;
  menuItemId?: string; // ID блюда из меню для бэкенда
}

export interface CartState {
  items: CartItem[];
  total: number;
}
