"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  UtensilsCrossed,
  Users,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { posService, cartUtils, type Product, type Category, type Table, type CartItem } from "@/services/pos";
import { TableSelector } from "@/components/TableSelector";
import { ProductCard } from "@/components/ProductCard";
import { CartItem } from "@/components/CartItem";

export default function POSPage() {
  // Состояние
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData, tablesData] = await Promise.all([
        posService.getProducts(),
        posService.getCategories(),
        posService.getTables()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setTables(tablesData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      showNotification('error', 'Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && product.is_available;
  });

  // Работа с корзиной
  const addToCart = (product: Product) => {
    setCart(prevCart => cartUtils.addToCart(prevCart, product));
    showNotification('success', `${product.name} добавлен в корзину`);
  };

  const updateQuantity = (itemId: string, change: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      setCart(prevCart => cartUtils.updateQuantity(prevCart, itemId, newQuantity));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => cartUtils.removeFromCart(prevCart, itemId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedTable("");
  };

  // Оформление заказа
  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      showNotification('error', 'Корзина пуста');
      return;
    }

    if (!selectedTable) {
      showNotification('error', 'Выберите стол');
      return;
    }

    try {
      setIsCreatingOrder(true);
      
      const orderData = {
        locationId: "default-location", // TODO: получить из контекста пользователя
        tableId: selectedTable,
        orderType: 'dine_in' as const,
        items: cart.map(item => ({
          menuItemId: item.product.id,
          quantity: item.quantity,
          specialInstructions: ""
        }))
      };

      await posService.createOrder(orderData);
      
      showNotification('success', 'Заказ успешно создан!');
      clearCart();
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      showNotification('error', 'Ошибка создания заказа');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Уведомления
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Загрузка
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Загрузка POS системы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Уведомления */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col">
        {/* Заголовок */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <UtensilsCrossed className="w-8 h-8 text-blue-600" />
            POS Система
          </h1>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Левая панель - Каталог товаров */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Поиск */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Категории */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Все
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Сетка товаров */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  index={index}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Товары не найдены</p>
              </div>
            )}
          </div>

          {/* Правая панель - Корзина */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Заголовок корзины */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                Корзина
                {cart.length > 0 && (
                  <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
                    {cartUtils.calculateTotalItems(cart)}
                  </span>
                )}
              </h2>
            </div>

            {/* Выбор стола */}
            <div className="p-4 border-b border-gray-200">
              <TableSelector
                tables={tables}
                selectedTable={selectedTable}
                onTableSelect={setSelectedTable}
                onTableClear={() => setSelectedTable("")}
              />
            </div>

            {/* Товары в корзине */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Корзина пуста</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Итого и кнопки */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {cart.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-green-600">{cartUtils.calculateTotal(cart)} ₽</span>
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    {cartUtils.calculateTotalItems(cart)} товаров
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <button
                  onClick={handleCreateOrder}
                  disabled={cart.length === 0 || !selectedTable || isCreatingOrder}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isCreatingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Создание заказа...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Оформить заказ
                    </>
                  )}
                </button>
                
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Очистить корзину
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}