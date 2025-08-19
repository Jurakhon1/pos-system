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
    <div className="flex h-screen bg-gray-100">
      {/* Левая панель - меню */}
      <div className="w-2/3 p-4 space-y-4">
        {/* Категории */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            Все
          </Button>
          {categories?.map((category: Category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Список блюд */}
        <div className="grid grid-cols-3 gap-4 overflow-y-auto h-[calc(100vh-12rem)]">
          {menuItems
            ?.filter((item: MenuItem) => 
              selectedCategory === null || item.categoryId === selectedCategory
            )
            ?.map((item: MenuItem) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  ...(item.imageUrl && { imageUrl: item.imageUrl }),
                  menuItemId: item.id
                })}
              >
                <div className="relative h-40 mb-2">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Нет фото</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <p className="font-bold text-blue-600 mt-2">{item.price} ₽</p>
              </div>
            ))}
          {menuItems
            ?.filter((item: MenuItem) => 
              selectedCategory === null || item.categoryId === selectedCategory
            )
            ?.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedCategory ? 'В этой категории нет блюд' : 'Нет доступных блюд'}
                </h3>
                <p className="text-gray-500">
                  {selectedCategory ? 'Попробуйте выбрать другую категорию' : 'Проверьте настройки меню'}
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Правая панель - корзина и детали заказа */}
      <div className="w-full md:w-1/3 bg-white border-l border-gray-200 p-6 flex flex-col gap-6 shadow-sm rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2" aria-label="Детали заказа">Детали заказа</h2>

        <div className="flex flex-col gap-4">
          {/* Order Type Selector */}
          <div className="bg-gray-50 p-4 rounded-md">
            <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-1">Тип заказа</label>
            <select
              id="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as 'dine_in' | 'takeaway')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Выбор типа заказа"
            >
              <option value="dine_in">На месте</option>
              <option value="takeaway">На вынос</option>
            </select>
          </div>

          {/* Customer Info Form */}
          <div className="bg-gray-50 p-4 rounded-md flex flex-col gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Имя клиента</label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Введите имя"
                aria-label="Имя клиента"
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Введите номер телефона"
                aria-label="Телефон клиента"
              />
            </div>
            <div>
              <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">Количество гостей</label>
              <input
                id="guestCount"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="1"
                placeholder="1"
                aria-label="Количество гостей"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Примечания</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Дополнительные примечания"
                rows={3}
                aria-label="Примечания к заказу"
              />
            </div>
          </div>

          {/* Table Selector (Conditional) */}
          {orderType === "dine_in" && (
            <div className="bg-gray-50 p-4 rounded-md">
              <label htmlFor="tableId" className="block text-sm font-medium text-gray-700 mb-1">Номер стола</label>
              <select
                id="tableId"
                value={tableId || ""}
                onChange={(e) => {
                  setTableId(e.target.value);
                  const selectedTable = tables?.find((table) => table.id === e.target.value);
                  setTableNumber(selectedTable ? selectedTable.number : null);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Выбор стола"
              >
                <option value="">Выберите стол</option>
                {tables?.map((table) => (
                  <option key={table.id} value={table.id}>
                    Стол {table.number}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cart */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Корзина</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Корзина пуста</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        aria-label={`Уменьшить количество ${item.name}`}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        aria-label={`Увеличить количество ${item.name}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        aria-label={`Удалить ${item.name} из корзины`}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                aria-label="Очистить корзину"
              >
                Очистить корзину
              </button>
            )}
          </div>

          {/* Order Summary */}
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Итог заказа</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">Тип заказа: {orderType === "dine_in" ? "На месте" : "На вынос"}</p>
              <p className="text-sm text-gray-600">Имя: {customerName || "Не указано"}</p>
              <p className="text-sm text-gray-600">Телефон: {customerPhone || "Не указано"}</p>
              {orderType === "dine_in" && <p className="text-sm text-gray-600">Стол: {tableNumber || "Не выбран"}</p>}
              <p className="text-sm text-gray-600">Итоговая сумма: {cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0)} ₽</p>
              <button
                onClick={handleCreateOrder}
                disabled={isCreating || cartItems.length === 0}
                className={`mt-4 w-full px-4 py-2 rounded-md text-white ${isCreating || cartItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                aria-label="Создать заказ"
              >
                {isCreating ? "Создание..." : "Создать заказ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
