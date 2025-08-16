import { useCallback } from 'react';
import { useOrders } from '@/entities/orders/hooks/useOrders';
import { useAuth } from '@/entities/auth/hooks/useAuth';
import { CreateOrderFromCart } from '@/shared/types/orders';
import { CartItem } from '@/entities/cart';

export const useOrderCreation = () => {
  const { createOrderFromCart, isCreatingFromCart } = useOrders();
  const { getCurrentUserId } = useAuth();

  const createOrder = useCallback((
    cartItems: CartItem[],
    tableNumber?: number | null,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
  ) => {
    // Валидация корзины
    if (cartItems.length === 0) {
      onError?.({ message: 'Корзина пуста' });
      return;
    }

    // Валидация количества товаров
    const invalidItems = cartItems.filter(item => item.quantity <= 0);
    if (invalidItems.length > 0) {
      onError?.({ message: 'Некорректное количество товаров' });
      return;
    }

    // Проверка авторизации
    const userId = getCurrentUserId();
    if (!userId) {
      onError?.({ message: 'Пользователь не авторизован' });
      return;
    }

    // Вычисление общей суммы
    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    // Создание данных заказа
    const orderData: CreateOrderFromCart = {
      cashierId: parseInt(userId),
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      total: total,
      table: tableNumber || undefined
    };

    // Отправка заказа
    createOrderFromCart(orderData, {
      onSuccess: (data) => {
        console.log('Order created successfully:', data);
        onSuccess?.(data);
      },
      onError: (error) => {
        console.error('Failed to create order:', error);
        onError?.(error);
      }
    });
  }, [createOrderFromCart, getCurrentUserId]);

  return {
    createOrder,
    isCreating: isCreatingFromCart,
  };
};
