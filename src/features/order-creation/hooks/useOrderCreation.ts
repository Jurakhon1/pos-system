import { useCallback } from 'react';
import { useOrders } from '@/entities/orders/hooks/useOrders';
import { useAuth } from '@/entities/auth/hooks/useAuth';
import { CreateOrderFromCart } from '@/shared/types/orders';
import { CartItem } from '@/entities/cart';

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  guestCount: number;
  notes: string;
  orderType: 'dine_in' | 'takeaway';
}

export const useOrderCreation = () => {
  const { createOrderFromCart, isCreatingFromCart } = useOrders();
  const { getCurrentUserId } = useAuth();

  const createOrder = useCallback((
    cartItems: CartItem[],
    tableId: string | null,
    formData: OrderFormData,
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

    // Валидация формы
    if (!formData.customerName.trim()) {
      onError?.({ message: 'Введите имя клиента' });
      return;
    }

    if (!formData.customerPhone.trim()) {
      onError?.({ message: 'Введите телефон клиента' });
      return;
    }

    // Валидация стола для заказов в ресторане
    if (formData.orderType === 'dine_in' && !tableId) {
      onError?.({ message: 'Выберите номер стола' });
      return;
    }

    // Создание данных заказа согласно бэкенду
    const orderData: CreateOrderFromCart = {
      locationId: "2", // Используем ID из примера
      tableId: tableId || undefined,
      orderType: formData.orderType,
      waiterId: userId,
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      guestCount: formData.guestCount,
      notes: formData.notes.trim() || 'Заказ через POS систему',
      items: cartItems.map(item => ({
        menuItemId: item.menuItemId || item.id.toString(),
        quantity: item.quantity,
        specialInstructions: formData.notes.trim() || undefined
      }))
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
