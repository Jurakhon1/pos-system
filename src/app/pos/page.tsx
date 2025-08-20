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
  Table as TableIcon,
  User,
  Calendar,
  FileText,
  CreditCard
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

  const totalAmount = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50">
      {/* Левая панель - управление заказом */}
      <div className="w-1/3 bg-white border-r-2 border-gray-300 p-6 flex flex-col gap-6 shadow-xl">
        <div className="text-center pb-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SmartChef POS</h1>
          <p className="text-gray-600 font-medium">Система управления заказами</p>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Тип заказа */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <label htmlFor="orderType" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Тип заказа
            </label>
            <select
              id="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as 'dine_in' | 'takeaway')}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
            >
              <option value="dine_in">🍽️ На месте</option>
              <option value="takeaway">📦 На вынос</option>
            </select>
          </div>

          {/* Информация о клиенте */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              Информация о клиенте
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Имя клиента</label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                  placeholder="Введите имя"
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">Количество гостей</label>
                <input
                  id="guestCount"
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Выбор стола (только для заказов на месте) */}
          {orderType === "dine_in" && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
              <label htmlFor="tableId" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-purple-600" />
                Выбор стола
              </label>
              <select
                id="tableId"
                value={tableId || ""}
                onChange={(e) => {
                  setTableId(e.target.value);
                  const selectedTable = tables?.find((table) => table.id === e.target.value);
                  setTableNumber(selectedTable ? selectedTable.number : null);
                }}
                className="w-full p-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-medium"
              >
                <option value="">🏠 Выберите стол</option>
                {tables?.map((table) => (
                  <option key={table.id} value={table.id}>
                    🪑 Стол {table.number}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Примечания */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              Примечания к заказу
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white resize-none"
              placeholder="Особые пожелания, аллергии, специи..."
              rows={3}
            />
          </div>

          {/* Корзина */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200 flex-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-red-600" />
              Корзина ({cartItems.length})
            </h3>
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Корзина пуста</p>
                <p className="text-gray-400 text-sm">Добавьте блюда из меню</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="font-bold text-blue-600">{item.price} ₽</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-gray-700 min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="mt-3 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
              >
                🗑️ Очистить корзину
              </button>
            )}
          </div>

          {/* Итоги и создание заказа */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              Итоги заказа
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Тип:</span>
                <span className="font-medium">{orderType === "dine_in" ? "🍽️ На месте" : "📦 На вынос"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Клиент:</span>
                <span className="font-medium">{customerName || "Не указано"}</span>
              </div>
              {orderType === "dine_in" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Стол:</span>
                  <span className="font-medium">{tableNumber || "Не выбран"}</span>
                </div>
              )}
              <div className="border-t border-indigo-200 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-indigo-600">{totalAmount} ₽</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCreateOrder}
              disabled={isCreating || cartItems.length === 0}
              className={`w-full px-6 py-3 rounded-lg text-white font-semibold text-lg transition-all ${
                isCreating || cartItems.length === 0 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {isCreating ? "⏳ Создание..." : "🚀 Создать заказ"}
            </button>
          </div>
        </div>
      </div>

      {/* Правая панель - меню */}
      <div className="w-2/3 p-6 space-y-6 bg-gradient-to-b from-transparent to-blue-50/30">
        {/* Заголовок и категории */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🍽️ Меню ресторана</h2>
          
          {/* Категории */}
          <div className="flex space-x-3 overflow-x-auto pb-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap px-6 py-3 font-semibold text-base shadow-md hover:shadow-lg transition-all"
            >
              🍽️ Все блюда
            </Button>
            {categories?.map((category: Category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap px-6 py-3 font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Список блюд */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto h-[calc(100vh-12rem)] pr-2 pb-6">
          {menuItems
            ?.filter((item: MenuItem) => 
              selectedCategory === null || item.categoryId === selectedCategory
            )
            ?.map((item: MenuItem) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-blue-300"
                onClick={() => addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  ...(item.imageUrl && { imageUrl: item.imageUrl }),
                  menuItemId: item.id
                })}
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">🍽️</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {item.price} ₽
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{item.price} ₽</span>
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-green-600 transition-colors">
                    ➕ Добавить
                  </div>
                </div>
              </div>
            ))}
          {menuItems
            ?.filter((item: MenuItem) => 
              selectedCategory === null || item.categoryId === selectedCategory
            )
            ?.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="text-gray-400 mb-6">
                  <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {selectedCategory ? 'В этой категории нет блюд' : 'Нет доступных блюд'}
                </h3>
                <p className="text-gray-500 text-lg">
                  {selectedCategory ? 'Попробуйте выбрать другую категорию' : 'Проверьте настройки меню'}
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
