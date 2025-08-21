"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/entities/cart";
import { useOrderCreation, OrderFormData } from "@/features/order-creation/hooks/useOrderCreation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { 
  ClipboardList, 
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Table as TableIcon,
  User,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Eye,
  Settings,
  Table
} from "lucide-react";
import { useMenuItems } from "@/entities/menu-item/hooks/useMenuItem";
import { useCategories } from "@/entities/categories/hooks/useCategories";
import { useTables } from "@/entities/tables/hooks/useTables";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  categoryId: string;
}

export default function POSPage() {
  const {menuItems}=useMenuItems();
  const {categories}=useCategories()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {tables}=useTables()
  const { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createOrder, isCreating } = useOrderCreation();
  
  // Загружаем данные при монтировании компонента

  // Проверяем системную тему при загрузке
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const handleCreateOrder = async () => {
    const formData: OrderFormData = {
      customerName,
      customerPhone,
      guestCount,
      notes,
      orderType
    };

    createOrder(
      cartItems,
      tableId,
      formData,
      () => {
        clearCart();
        setCustomerName("");
        setCustomerPhone("");
        setTableNumber(null);
        setTableId(null);
        setGuestCount(1);
        setNotes("");
        setOrderType('dine_in');
        alert("Заказ успешно создан!");
      },
      (error) => {
        alert(`Ошибка создания заказа: ${error.message}`);
      }
    );
  };

  const totalAmount = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  // Фильтрация блюд по поиску
  const filteredMenuItems = menuItems?.filter((item: MenuItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Верхняя панель навигации */}
      <div className={`backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-700' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SmartChef POS
                </h1>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-slate-600"></div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hidden sm:flex"
              >
                {isDarkMode ? <Settings className="w-4 h-4 mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
                {isDarkMode ? 'Светлая' : 'Темная'}
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <User className="w-4 h-4 mr-2" />
                Админ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Левая панель - управление заказом */}
          <div className="xl:col-span-1 space-y-6">
            {/* Карточка типа заказа */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Тип заказа
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOrderType('dine_in')}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      orderType === 'dine_in'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : isDarkMode
                          ? 'border-slate-600 hover:border-blue-400 hover:bg-blue-900/10 text-slate-300'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🍽️</div>
                      <div className="font-medium text-sm">На месте</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setOrderType('takeaway')}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      orderType === 'takeaway'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : isDarkMode
                          ? 'border-slate-600 hover:border-green-400 hover:bg-green-900/10 text-slate-300'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">📦</div>
                      <div className="font-medium text-sm">На вынос</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Карточка информации о клиенте */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Информация о клиенте
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>Имя клиента</label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Введите имя"
                    className={`w-full ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' 
                        : ''
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>Телефон</label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className={`w-full ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' 
                        : ''
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>Количество гостей</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className={`w-10 h-10 p-0 ${
                        isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className={`w-16 text-center font-semibold text-lg ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-900'
                    }`}>{guestCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuestCount(guestCount + 1)}
                      className={`w-10 h-10 p-0 ${
                        isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Карточка выбора стола */}
            {orderType === "dine_in" && (
              <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4">
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <TableIcon className="w-5 h-5" />
                    Выбор стола
                  </h2>
                </div>
                <div className="p-4">
                  <select
                    value={tableId || ""}
                    onChange={(e) => {
                      setTableId(e.target.value);
                      const selectedTable = tables?.find((table) => table.id === e.target.value);
                      setTableNumber(selectedTable ? selectedTable.number : null);
                    }}
                    className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-slate-200' 
                        : 'bg-white border-purple-200'
                    }`}
                  >
                    <option value="">🏠 Выберите стол</option>
                    {tables?.map((table) => (
                      <option key={table.id} value={table.id}>
                        🪑 Стол {table.number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Карточка примечаний */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Примечания
                </h2>
              </div>
              <div className="p-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Особые пожелания, аллергии, специи..."
                  rows={3}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' 
                      : 'bg-white border-orange-200'
                  }`}
                />
              </div>
            </div>

            {/* Карточка корзины */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Корзина ({cartItems.length})
                </h2>
              </div>
              <div className="p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                    }`}>
                      <ShoppingCart className={`w-8 h-8 ${
                        isDarkMode ? 'text-slate-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>Корзина пуста</p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-500' : 'text-gray-400'
                    }`}>Добавьте блюда из меню</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className={`p-3 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-medium text-sm ${
                            isDarkMode ? 'text-slate-200' : 'text-gray-800'
                          }`}>{item.name}</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{item.price} ₽</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={`w-8 h-8 p-0 ${
                                isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-600' : ''
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className={`font-semibold min-w-[2rem] text-center ${
                              isDarkMode ? 'text-slate-200' : 'text-gray-700'
                            }`}>{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={`w-8 h-8 p-0 ${
                                isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-600' : ''
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className={`w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                              isDarkMode ? 'border-slate-600 hover:bg-slate-600' : ''
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cartItems.length > 0 && (
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className={`mt-4 w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                      isDarkMode ? 'border-slate-600 text-red-400 hover:bg-slate-700' : ''
                    }`}
                  >
                    🗑️ Очистить корзину
                  </Button>
                )}
              </div>
            </div>

            {/* Карточка итогов */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Итоги заказа
                </h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Тип:</span>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-900'
                  }`}>{orderType === "dine_in" ? "🍽️ На месте" : "📦 На вынос"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Клиент:</span>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-900'
                  }`}>{customerName || "Не указано"}</span>
                </div>
                {orderType === "dine_in" && (
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Стол:</span>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-900'
                    }`}>{tableNumber || "Не выбран"}</span>
                  </div>
                )}
                <div className={`border-t pt-3 mt-3 ${
                  isDarkMode ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between text-xl font-bold">
                    <span className={isDarkMode ? 'text-slate-200' : 'text-gray-900'}>Итого:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{totalAmount} ₽</span>
                  </div>
                </div>
                <Button
                  onClick={handleCreateOrder}
                  disabled={isCreating || cartItems.length === 0}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                    isCreating || cartItems.length === 0 
                      ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Создание...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Создать заказ
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Правая панель - меню */}
          <div className="xl:col-span-2 space-y-6">
            {/* Панель поиска и фильтров */}
            <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <Input
                      placeholder="Поиск блюд..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-10 w-full ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' 
                          : ''
                      }`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`px-3 ${
                        isDarkMode && viewMode !== 'grid' ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''
                      }`}
                    >
                      <Table className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`px-3 ${
                        isDarkMode && viewMode !== 'list' ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Категории */}
              <div className="mt-6">
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className={`whitespace-nowrap px-6 py-3 font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 ${
                      isDarkMode && selectedCategory !== null ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''
                    }`}
                  >
                    🍽️ Все блюда
                  </Button>
                  {categories?.map((category: Category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`whitespace-nowrap px-6 py-3 font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 ${
                        isDarkMode && selectedCategory !== category.id ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''
                      }`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Список блюд */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems?.map((item: MenuItem) => (
                  <div
                    key={item.id}
                    className={`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border overflow-hidden cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 hover:border-blue-500' 
                        : 'bg-white border-gray-100 hover:border-blue-300'
                    }`}
                    onClick={() => addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      ...(item.imageUrl && { imageUrl: item.imageUrl }),
                      menuItemId: item.id
                    })}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                          isDarkMode 
                            ? 'bg-gradient-to-br from-slate-700 to-slate-600' 
                            : 'bg-gradient-to-br from-gray-200 to-gray-300'
                        }`}>
                          <span className={`text-4xl ${
                            isDarkMode ? 'text-slate-500' : 'text-gray-500'
                          }`}>🍽️</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {item.price} ₽
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                    <div className="p-4">
                      <h3 className={`font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                        isDarkMode ? 'text-slate-200' : 'text-gray-800'
                      }`}>
                        {item.name}
                      </h3>
                      <p className={`text-sm line-clamp-2 mb-3 ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.price} ₽</span>
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-green-600 transition-all duration-200 transform hover:scale-105">
                          ➕ Добавить
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMenuItems?.map((item: MenuItem) => (
                  <div
                    key={item.id}
                    className={`group rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border overflow-hidden cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 hover:border-blue-500' 
                        : 'bg-white border-gray-100 hover:border-blue-300'
                    }`}
                    onClick={() => addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      ...(item.imageUrl && { imageUrl: item.imageUrl }),
                      menuItemId: item.id
                    })}
                  >
                    <div className="flex">
                      <div className="relative w-32 h-24 flex-shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            isDarkMode 
                              ? 'bg-gradient-to-br from-slate-700 to-slate-600' 
                              : 'bg-gradient-to-br from-gray-200 to-gray-300'
                          }`}>
                            <span className={`text-2xl ${
                              isDarkMode ? 'text-slate-500' : 'text-gray-500'
                            }`}>🍽️</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`font-bold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                              isDarkMode ? 'text-slate-200' : 'text-gray-800'
                            }`}>
                              {item.name}
                            </h3>
                            <p className={`text-sm line-clamp-2 ${
                              isDarkMode ? 'text-slate-400' : 'text-gray-600'
                            }`}>{item.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{item.price} ₽</div>
                            <Button className="bg-green-500 hover:bg-green-600 text-white">
                              ➕ Добавить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Сообщение об отсутствии блюд */}
            {filteredMenuItems?.length === 0 && (
              <div className={`rounded-2xl shadow-xl border p-12 text-center transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <AlertTriangle className={`w-12 h-12 ${
                    isDarkMode ? 'text-slate-500' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-900'
                }`}>
                  {selectedCategory ? 'В этой категории нет блюд' : 'Нет доступных блюд'}
                </h3>
                <p className={`text-lg mb-6 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {selectedCategory ? 'Попробуйте выбрать другую категорию' : 'Проверьте настройки меню'}
                </p>
                {selectedCategory && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(null)}
                    className={`px-6 py-3 ${
                      isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''
                    }`}
                  >
                    Показать все блюда
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
