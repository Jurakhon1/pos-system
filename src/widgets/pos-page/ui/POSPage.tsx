"use client";

import { useState } from "react";
import { ProductCatalogComponent } from "@/features/product-catalog/ui/ProductCatalog";
import { ShoppingCartComponent } from "@/features/shopping-cart/ui/ShoppingCart";
import { OrderForm } from "@/features/order-creation/ui/OrderForm";
import { AnimatedNotification } from "@/features/notification";
import { useProducts } from "@/entities/products/hooks/useProducts";
import { useCategories } from "@/entities/categories/hooks/useCategories";
import { useCart } from "@/entities/cart/hooks/useCart";
import { useOrderCreation } from "@/features/order-creation/hooks/useOrderCreation";
import { Products } from "@/shared/types/products";
import { OrderFormData } from "@/features/order-creation/hooks/useOrderCreation";

export const POSPageComponent = () => {
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

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
  const handleCreateOrder = (formData: OrderFormData) => {
    createOrder(
      items,
      selectedTable,
      formData,
      () => {
        // Успешное создание заказа
        clearCart();
        setSelectedTable(null); // Сброс выбранного стола
        setShowOrderForm(false); // Скрываем форму
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

  // Обработка нажатия на кнопку оформления заказа
  const handleCheckoutClick = () => {
    if (items.length === 0) {
      setNotification({ type: 'error', message: 'Корзина пуста' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setShowOrderForm(true);
  };

  // Состояния загрузки и ошибок
  const isLoading = productsLoading || categoriesLoading;
  const hasError = productsError || categoriesError;

  // Функция для обновления страницы
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

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
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Показываем форму заказа поверх основного интерфейса
  if (showOrderForm) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <OrderForm
            selectedTable={selectedTable}
            onSubmit={handleCreateOrder}
            isSubmitting={isCreating}
          />
          <div className="text-center mt-4">
            <button
              onClick={() => setShowOrderForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Вернуться к POS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Convert Product[] to Products[] for ProductCatalog
  const convertedProducts: Products[] = (products || []).map(product => ({
    id: parseInt(product.id),
    name: product.name,
    description: product.description,
    price: product.purchase_price,
    category: {
      id: parseInt(product.category.id),
      name: product.category.name
    },
    imageUrl: undefined
  }));

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
            products={convertedProducts}
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
            onCheckout={handleCheckoutClick}
            onTableSelect={setSelectedTable}
            onTableClear={() => setSelectedTable(null)}
            isCheckoutLoading={isCreating}
          />
        </div>
      </div>
    </div>
  );
};
