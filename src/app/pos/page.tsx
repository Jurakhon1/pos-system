"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/entities/cart";
import { useOrderCreation, OrderFormData } from "@/features/order-creation/hooks/useOrderCreation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { 
  Users, 
  Phone, 
  ClipboardList, 
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Table as TableIcon
} from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/entities/cart";
import {  useMenuItems } from "@/entities/menu-item/hooks/useMenuItem";
import { useCategories } from "@/entities/categories/hooks/useCategories";
import { useTables } from "@/entities/tables/hooks/useTables";
import { Table as TableType } from "@/entities/tables/api/tableApi";

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
  const {tables,isLoading,error,fetchTables,updateTableStatus}=useTables()
  const { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createOrder, isCreating } = useOrderCreation();
  
  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const locationId = localStorage.getItem("locationId");
    if (locationId) {
      fetchTables();
    }
  }, [fetchTables]);
  
  // Проверяем наличие locationId
  const locationId = localStorage.getItem("locationId");
  if (!locationId) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Не выбран ресторан</h2>
          <p className="text-gray-600">Пожалуйста, выберите ресторан для продолжения работы</p>
        </div>
      </div>
    );
  }


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
      (data) => {
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Левая панель - меню */}
      <div className="w-2/3 p-6 space-y-6 overflow-hidden">
        {/* Заголовок страницы */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">��️ POS Система</h1>
          <p className="text-gray-600">Выберите блюда и создайте заказ</p>
        </div>
        
        {/* Категории */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory 
                ? categories?.find((cat: Category) => cat.id === selectedCategory)?.name 
                : 'Все блюда'
              }
            </h2>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
              >
                ← Показать все
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {categories?.map((category: Category) => {
              const itemCount = menuItems?.filter((item: MenuItem) => item.categoryId === category.id).length || 0;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex-shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
                  }`}
                >
                  {category.name}
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Индикатор загрузки категорий */}
          {!categories && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-500 font-medium">Загрузка категорий...</p>
            </div>
          )}
          
          {/* Ошибка загрузки категорий */}
          {categories && categories.length === 0 && (
            <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-600 font-medium">Не удалось загрузить категории</p>
            </div>
          )}
        </div>

        {/* Список блюд */}
        <div className="grid grid-cols-3 gap-6 overflow-y-auto h-[calc(100vh-16rem)] scrollbar-hide">
          {/* Индикатор загрузки меню */}
          {!menuItems && (
            <div className="col-span-3 text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Загрузка меню...</h3>
              <p className="text-gray-500">Пожалуйста, подождите</p>
            </div>
          )}
          
          {/* Список блюд */}
          {menuItems
            ?.filter((item: MenuItem) => 
              selectedCategory === null || item.categoryId === selectedCategory
            )
            ?.map((item: MenuItem) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-100 overflow-hidden"
                onClick={() => addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  ...(item.imageUrl && { imageUrl: item.imageUrl }),
                  menuItemId: item.id
                })}
              >
                <div className="relative h-48 mb-4 overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="rounded-t-2xl object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-medium">Нет фото</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-t-2xl"></div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                
                <div className="px-5 pb-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xl text-green-600">
                      {item.price.toLocaleString('ru-RU')} ₽
                    </p>
                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      В корзину
                    </div>
                  </div>
                </div>
              </div>
            ))}
          
          {/* Сообщение о пустом списке */}
          {menuItems
            ?.filter((item: MenuItem) => 
              selectedCategory === null || item.categoryId === selectedCategory
            )
            ?.length === 0 && menuItems && menuItems.length > 0 && (
              <div className="col-span-3 text-center py-16">
                <div className="text-gray-400 mb-6">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {selectedCategory ? 'В этой категории нет блюд' : 'Нет доступных блюд'}
                </h3>
                <p className="text-gray-500">
                  {selectedCategory ? 'Попробуйте выбрать другую категорию' : 'Проверьте настройки меню'}
                </p>
              </div>
            )}
          
          {/* Сообщение об отсутствии меню */}
          {menuItems && menuItems.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <div className="text-gray-400 mb-6">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Меню пусто</h3>
              <p className="text-gray-500">Добавьте блюда в меню</p>
            </div>
          )}
        </div>
      </div>

      {/* Правая панель - корзина и детали заказа */}
      <div className="w-1/3 bg-white shadow-2xl border-l border-gray-200 p-6 flex flex-col">
        {/* Заголовок */}
      
        
        {/* Тип заказа */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            📋 Тип заказа
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={orderType === 'dine_in' ? "default" : "outline"}
              onClick={() => setOrderType('dine_in')}
              className={`h-12 font-medium transition-all duration-200 ${
                orderType === 'dine_in' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              🍽️ В ресторане
            </Button>
            <Button
              variant={orderType === 'takeaway' ? "default" : "outline"}
              onClick={() => setOrderType('takeaway')}
              className={`h-12 font-medium transition-all duration-200 ${
                orderType === 'takeaway' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg' 
                  : 'hover:bg-green-50 hover:border-green-300'
              }`}
            >
              🚀 На вынос
            </Button>
          </div>
        </div>

        {/* Информация о клиенте */}
        <div className="space-y-5 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
           
            
            <div className="space-y-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Имя клиента"
                  className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                  required
                />
              </div>
              
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Телефон"
                  className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                  required
                />
              </div>

              {/* Выбор стола (только для заказов в ресторане) */}
              {orderType === 'dine_in' && (
                <div className="space-y-3">
                 
                  <div className="relative">
                    <select
                      value={tableId || ''}
                      onChange={(e) => {
                        const selectedTable = tables?.find(table => table.id === e.target.value);
                        if (selectedTable) {
                          setTableNumber(selectedTable.number);
                          setTableId(selectedTable.id);
                        } else {
                          setTableNumber(null);
                          setTableId(null);
                        }
                      }}
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-400 h-12"
                      required
                    >
                      <option value="" className="text-gray-500">Выберите стол</option>
                      {tables
                        ?.filter((table) => table.location_id === localStorage.getItem("locationId"))
                        ?.sort((a, b) => a.number - b.number)
                        ?.map((table) => (
                          <option 
                            key={table.id} 
                            value={table.id}
                            disabled={!table.is_active}
                            className={!table.is_active ? 'text-gray-400 bg-gray-100' : 'text-gray-700'}
                          >
                            {table.is_active ? '🟢' : '🔴'} Стол {table.number} {!table.is_active ? '(занят)' : '(свободен)'}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <TableIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {tableId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTableNumber(null);
                          setTableId(null);
                        }}
                        className="absolute inset-y-0 right-12 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                        title="Очистить выбор стола"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                  
                  {tableNumber && (
                    <p className="text-sm text-green-600 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <TableIcon className="h-4 w-4" />
                      Выбран стол: {tableNumber}
                    </p>
                  )}
                </div>
              )}

              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  placeholder="Количество гостей"
                  className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                  min={1}
                  max={20}
                />
              </div>

              <div className="relative">
                <ClipboardList className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Примечания к заказу"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Корзина */}
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-4">
          <div className="sticky top-0 bg-gray-50 pb-4 mb-4 border-b border-gray-200">
            <h3 className="font-bold mb-3 flex items-center gap-3 text-xl text-gray-800">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              Корзина
              {cartItems.length > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </h3>
            {cartItems.length > 0 && (
              <p className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
                💰 Общая сумма: <span className="font-bold text-green-600">
                  {cartItems.reduce((sum: number, item: CartItem) => sum + Number(item.price) * item.quantity, 0).toLocaleString('ru-RU')} ₽
                </span>
              </p>
            )}
          </div>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Корзина пуста</h4>
              <p className="text-gray-500 text-sm">Добавьте товары из меню</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded-lg inline-block">
                        💰 {Number(item.price).toLocaleString('ru-RU')} ₽ × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="font-bold text-green-600 text-xl">
                        {(Number(item.price) * item.quantity).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 p-0 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all rounded-lg"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-16 text-center font-bold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg text-lg">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 p-0 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all rounded-lg"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Итого и кнопка создания заказа */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-800">💰 Итого:</span>
              <span className="text-3xl font-bold text-green-600">
                {cartItems.reduce((sum: number, item: CartItem) => sum + Number(item.price) * item.quantity, 0).toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <span className="block text-gray-600 mb-1">Товаров</span>
                <span className="text-lg font-bold text-blue-600">{cartItems.length}</span>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <span className="block text-gray-600 mb-1">Позиций</span>
                <span className="text-lg font-bold text-purple-600">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-xl"
            size="lg"
            onClick={handleCreateOrder}
            disabled={isCreating || cartItems.length === 0 || !customerName.trim() || !customerPhone.trim() || (orderType === 'dine_in' && !tableId)}
          >
            {isCreating ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Создание заказа...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                🚀 Создать заказ
              </div>
            )}
          </Button>
          
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              className="w-full mt-4 h-12 text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
              onClick={clearCart}
            >
              <Trash2 className="h-5 w-5 mr-2" />
              🗑️ Очистить корзину
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
