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
  CreditCard,
  Search,
  Filter,
  
  Clock,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/entities/cart";
import { useMenuItems } from "@/entities/menu-item/hooks/useMenuItem";
import { useCategories } from "@/entities/categories/hooks/useCategories";
import { useTables } from "@/entities/tables/hooks/useTables";
import { Table as TableType } from "@/entities/tables/api/tableApi";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

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
  const { menuItems } = useMenuItems();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const { tables, isLoading, error, fetchTables, updateTableStatus } = useTables();
  const { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createOrder, isCreating } = useOrderCreation();

  const handleCreateOrder = async () => {
    const formData: OrderFormData = {
      customerName: customerName || "Гость",
      customerPhone: customerPhone || "",
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
        setShowOrderForm(false);
        setShowCustomerForm(false);
        alert("Заказ успешно создан!");
      },
      (error) => {
        alert(`Ошибка создания заказа: ${error.message}`);
      }
    );
  };

  const totalAmount = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  // Фильтрация блюд по поиску и категории
  const filteredMenuItems = menuItems?.filter((item: MenuItem) => {
    const matchesCategory = selectedCategory === null || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickOrder = () => {
    if (cartItems.length === 0) return;
    
    if (orderType === 'dine_in' && !tableId) {
      // Если заказ на месте, но стол не выбран, показываем форму
      setShowCustomerForm(true);
    } else {
      // Если заказ на вынос или стол выбран, создаем заказ сразу
      handleCreateOrder();
    }
  };

  return (
    <RoleGuard requiredRoles={[USER_ROLES.CASHIER, USER_ROLES.WAITER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
      <div className="min-h-screen bg-gray-50">
        {/* Верхняя панель навигации */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Основная область - Меню */}
          <div className="flex-1 transition-all duration-300 pr-96">
            <div className="p-6">
              {/* Поиск и фильтры */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Поиск блюд..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(null)}
                    className="h-12 px-6"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Сбросить
                  </Button>
                </div>

                {/* Категории */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className="whitespace-nowrap px-6 py-3 h-auto"
                  >
                    🍽️ Все блюда
                  </Button>
                  {categories?.map((category: Category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap px-6 py-3 h-auto"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Список блюд */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuItems?.map((item: MenuItem) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 group cursor-pointer"
                    onClick={() => addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      ...(item.imageUrl && { imageUrl: item.imageUrl }),
                      menuItemId: item.id
                    })}
                  >
                    <div className="relative">
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-4xl">🍽️</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {item.price} ₽
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-transform duration-200 rounded-t-xl" />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">{item.price} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMenuItems?.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="mx-auto h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Блюда не найдены
                  </h3>
                  <p className="text-gray-500">
                    Попробуйте изменить поисковый запрос или выберите другую категорию
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Боковая панель - Сначала корзина */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl z-50">
            <div className="h-full flex flex-col">
              {/* Заголовок панели */}
              <div className="bg-blue-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Корзина заказа</h2>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="bg-white text-blue-600 text-sm font-bold rounded-full px-2 py-1 min-w-[20px]">
                      {cartItems.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Содержимое панели */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Тип заказа */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Тип заказа
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={orderType === 'dine_in' ? 'default' : 'outline'}
                      onClick={() => setOrderType('dine_in')}
                      className="h-11"
                    >
                      🍽️ На месте
                    </Button>
                    <Button
                      variant={orderType === 'takeaway' ? 'default' : 'outline'}
                      onClick={() => setOrderType('takeaway')}
                      className="h-11"
                    >
                      📦 На вынос
                    </Button>
                  </div>
                </div>

                {/* Корзина */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-red-600" />
                    Товары в корзине
                  </h3>
                  
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Корзина пуста</p>
                      <p className="text-sm">Добавьте блюда из меню</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                            <span className="font-bold text-blue-600">{item.price} ₽</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="font-semibold text-gray-700 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
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
                      variant="outline"
                      onClick={clearCart}
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Очистить корзину
                    </Button>
                  )}
                </div>

                {/* Итоги */}
                {cartItems.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      Итоги заказа
                    </h3>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Тип:</span>
                        <span className="font-medium">
                          {orderType === "dine_in" ? "🍽️ На месте" : "📦 На вынос"}
                        </span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 mt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Итого:</span>
                          <span className="text-blue-600">{totalAmount} ₽</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Кнопки действий */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleQuickOrder}
                        disabled={isCreating}
                        className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
                      >
                        {isCreating ? (
                          <>
                            <Clock className="w-5 h-5 mr-2 animate-spin" />
                            Создание...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Быстрый заказ
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => setShowCustomerForm(true)}
                        variant="outline"
                        className="w-full h-11"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Детали заказа
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Модальное окно для деталей заказа */}
          {showCustomerForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Детали заказа</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCustomerForm(false)}
                    className="h-8 w-8 p-0"
                  >
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Информация о клиенте (необязательно) */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      Информация о клиенте (необязательно)
                    </h3>
                    <Input
                      placeholder="Имя клиента (если нужно)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="h-11"
                    />
                    <Input
                      placeholder="Телефон (если нужно)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="h-11"
                    />
                    <Input
                      type="number"
                      placeholder="Количество гостей"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      min="1"
                      className="h-11"
                    />
                  </div>

                  {/* Выбор стола */}
                  {orderType === "dine_in" && (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <TableIcon className="w-4 h-4 text-purple-600" />
                        Выбор стола
                      </label>
                      <select
                        value={tableId || ""}
                        onChange={(e) => {
                          setTableId(e.target.value);
                          const selectedTable = tables?.find((table) => table.id === e.target.value);
                          setTableNumber(selectedTable ? selectedTable.number : null);
                        }}
                        className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                  {/* Примечания */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-600" />
                      Примечания (необязательно)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Особые пожелания, аллергии..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Кнопки */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomerForm(false)}
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={handleCreateOrder}
                      disabled={isCreating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isCreating ? "Создание..." : "Создать заказ"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}