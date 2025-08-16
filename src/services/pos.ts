import { api } from '@/shared/api/axios';

// Типы для API
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  is_available: boolean;
  image_url?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  zone?: string;
  is_active: boolean;
  location_id: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface CreateOrderDto {
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

// POS API сервис
export const posService = {
  // Получение всех товаров
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  // Получение всех категорий
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  // Получение всех столов
  async getTables(locationId?: string): Promise<Table[]> {
    const params = locationId ? { locationId } : {};
    const response = await api.get('/tables', { params });
    return response.data;
  },

  // Создание заказа
  async createOrder(orderData: CreateOrderDto) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Получение заказов по столу
  async getOrdersByTable(tableId: string) {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
  },

  // Получение заказов по статусу
  async getOrdersByStatus(locationId: string, status: string) {
    const response = await api.get(`/orders`, {
      params: { location_id: locationId, status }
    });
    return response.data;
  }
};

// Утилиты для работы с корзиной
export const cartUtils = {
  // Добавление товара в корзину
  addToCart(cart: CartItem[], product: Product, quantity: number = 1): CartItem[] {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      return cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        price: product.price,
        total: product.price * quantity
      };
      return [...cart, newItem];
    }
  },

  // Обновление количества товара
  updateQuantity(cart: CartItem[], itemId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return cart.filter(item => item.id !== itemId);
    }
    
    return cart.map(item =>
      item.id === itemId
        ? { ...item, quantity, total: item.price * quantity }
        : item
    );
  },

  // Удаление товара из корзины
  removeFromCart(cart: CartItem[], itemId: string): CartItem[] {
    return cart.filter(item => item.id !== itemId);
  },

  // Очистка корзины
  clearCart(): CartItem[] {
    return [];
  },

  // Подсчет общей суммы
  calculateTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + item.total, 0);
  },

  // Подсчет общего количества товаров
  calculateTotalItems(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};
