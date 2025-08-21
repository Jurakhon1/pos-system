import { useState, useCallback, useMemo } from 'react';
import { CartItem } from '../model/types';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Добавить товар в корзину
  const addToCart = useCallback((product: { id?: number | string; name: string; price: string | number; imageUrl?: string; menuItemId?: string }) => {
    if (!product.id) return;
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevItems, { 
        id: product.id!, 
        name: product.name, 
        price: Number(product.price), 
        quantity: 1,
        imageUrl: product.imageUrl,
        menuItemId: product.menuItemId || product.id!.toString()
      }];
    });
  }, []);

  // Обновить количество товара
  const updateQuantity = useCallback((id: number | string, change: number) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }, []);

  // Удалить товар из корзины
  const removeFromCart = useCallback((id: number | string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  // Очистить корзину
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Вычислить общую сумму
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [items]);

  // Проверить, пуста ли корзина
  const isEmpty = useMemo(() => items.length === 0, [items]);

  // Получить количество товаров в корзине
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    total,
    isEmpty,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};
