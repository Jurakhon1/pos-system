export interface CartItem {
  id: number;
  name: string;
  price: string | number;
  quantity: number;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
}
