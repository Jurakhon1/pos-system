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
      <div className="w-1/3 bg-white border-l p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Детали заказа</h2>
        
        {/* Тип заказа */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Тип заказа
          </label>
          <div className="flex gap-2">
            <Button
              variant={orderType === 'dine_in' ? "default" : "outline"}
              onClick={() => setOrderType('dine_in')}
              className="flex-1"
            >
              В ресторане
            </Button>
            <Button
              variant={orderType === 'takeaway' ? "default" : "outline"}
              onClick={() => setOrderType('takeaway')}
              className="flex-1"
            >
              На вынос
            </Button>
          </div>
        </div>

        {/* Информация о клиенте */}
        <div className="space-y-4 mb-4">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Имя клиента"
              className="pl-10"
              required
            />
          </div>
          
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Телефон"
              className="pl-10"
              required
            />
          </div>

          {/* Выбор стола (только для заказов в ресторане) */}
          {orderType === 'dine_in' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Номер стола
              </label>
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
                  className="w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-400"
                  required
                >
                  <option value="" className="text-gray-500">Выберите стол</option>
                  {tables
                    ?.filter((table) => table.location_id === localStorage.getItem("locationId"))
                    ?.sort((a, b) => a.number - b.number) // Сортируем по номеру стола
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <TableIcon className="h-4 w-4 text-gray-400" />
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
                    className="absolute inset-y-0 right-8 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition-colors"
                    title="Очистить выбор стола"
                  >
                    ✕
                  </Button>
                )}
              </div>
              {tableNumber && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <TableIcon className="h-4 w-4" />
                  Выбран стол: {tableNumber}
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              placeholder="Количество гостей"
              className="pl-10"
              min={1}
              max={20}
            />
          </div>

          <div className="relative">
            <ClipboardList className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Примечания к заказу"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>

        {/* Корзина */}
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-gray-100">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Корзина
              {cartItems.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </h3>
            {cartItems.length > 0 && (
              <p className="text-sm text-gray-500">
                Общая сумма: <span className="font-semibold text-green-600">
                  {cartItems.reduce((sum: number, item: CartItem) => sum + Number(item.price) * item.quantity, 0).toLocaleString('ru-RU')} ₽
                </span>
              </p>
            )}
          </div>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Корзина пуста</p>
              <p className="text-gray-400 text-xs">Добавьте товары из меню</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {Number(item.price).toLocaleString('ru-RU')} ₽ × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="font-bold text-green-600 text-lg">
                        {(Number(item.price) * item.quantity).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0 hover:bg-red-50 hover:border-red-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center font-medium text-gray-700 bg-white px-2 py-1 rounded border">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0 hover:bg-green-50 hover:border-green-200"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Итого и кнопка создания заказа */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-700">Итого:</span>
              <span className="text-2xl font-bold text-green-600">
                {cartItems.reduce((sum: number, item: CartItem) => sum + Number(item.price) * item.quantity, 0).toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Товаров: {cartItems.length}</span>
              <span>Позиций: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
          </div>
          
          <Button
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            size="lg"
            onClick={handleCreateOrder}
            disabled={isCreating || cartItems.length === 0 || !customerName.trim() || !customerPhone.trim() || (orderType === 'dine_in' && !tableId)}
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Создание заказа...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Создать заказ
              </div>
            )}
          </Button>
          
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              className="w-full mt-3 text-gray-600 hover:text-red-600 hover:border-red-300"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Очистить корзину
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
