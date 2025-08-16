"use client";

import { useState } from "react";
import { ProductCatalogComponent } from "@/features/product-catalog/ui/ProductCatalog";
import { ShoppingCartComponent } from "@/features/shopping-cart/ui/ShoppingCart";
import { AnimatedNotification } from "@/features/notification";
import { useProducts } from "@/entities/product";
import { useCategories } from "@/entities/categories/hooks/useCategories";
import { useCart } from "@/entities/cart/hooks/useCart";
import { useOrderCreation } from "@/features/order-creation/hooks/useOrderCreation";
import { Products } from "@/shared/types/products";
export const POSPageComponent = () => {
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  // API hooks
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Корзина
  const { 
    items, 
    total, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  // Создание заказа
  const { createOrder, isCreating } = useOrderCreation();

  // Обработка создания заказа
  const handleCreateOrder = () => {
    createOrder(
      items,
      selectedTable,
      (data) => {
        // Успешное создание заказа
        clearCart();
        setSelectedTable(null); // Сброс выбранного стола
        setNotification({ type: 'success', message: 'Заказ успешно создан!' });
        setTimeout(() => setNotification(null), 3000);
      },
      (error) => {
        // Ошибка создания заказа
        setNotification({ type: 'error', message: error.message || 'Ошибка при создании заказа' });
        setTimeout(() => setNotification(null), 3000);
      }
    );
  };

  // Обработка добавления товара в корзину
  const handleAddToCart = (product: Products) => {
    addToCart(product);
  };

  // Состояния загрузки и ошибок
  const isLoading = productsLoading || categoriesLoading;
  const hasError = productsError || categoriesError;

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ошибка загрузки данных</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Уведомления */}
      <AnimatedNotification
        type={notification?.type || 'success'}
        message={notification?.message || ''}
        onClose={() => setNotification(null)}
        isVisible={!!notification}
      />
      
      {/* Основной контент */}
      <div className="flex flex-1">
        {/* Левая сторона - Каталог товаров */}
        <div className="w-[70%] p-4">
          <ProductCatalogComponent
            products={products || []}
            categories={categories || []}
            onAddToCart={handleAddToCart}
            isLoading={isLoading}
          />
        </div>

        {/* Правая сторона - Корзина */}
        <div className="w-[30%]">
          <ShoppingCartComponent
            items={items}
            total={total}
            selectedTable={selectedTable}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCreateOrder}
            onTableSelect={setSelectedTable}
            onTableClear={() => setSelectedTable(null)}
            isCheckoutLoading={isCreating}
          />
        </div>
      </div>
    </div>
  );
};
