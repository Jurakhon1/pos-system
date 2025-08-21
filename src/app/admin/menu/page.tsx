"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Scale,
  XCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/entities/categories/hooks/useCategories";
import { useMenuItems } from "@/entities/menu-item/hooks/useMenuItem";
import { MenuItem } from "@/shared/types/menu";
import { Category } from "@/entities/categories/api/categoriesApi";
import Image from "next/image";

// Модальное окно для создания/редактирования пункта меню
const MenuItemModal = ({ 
  menuItem, 
  isOpen, 
  onClose, 
  onSave,
  isLoading
}: { 
  menuItem: MenuItem | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (data: Partial<MenuItem>) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0",
    calories: 0
  });

  // Сброс формы при открытии/закрытии модала
  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        description: menuItem.description || "",
        price: menuItem.price || "0",
        calories: menuItem.calories || 0
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "0",
        calories: 0
      });
    }
  }, [menuItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {menuItem ? "Редактировать пункт меню" : "Новый пункт меню"}
            </h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введите название блюда"
                  required
                  disabled={isLoading}
                />
              </div>
              
              
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание блюда"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                required
                disabled={isLoading}
              />
            </div>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Цена *
                 </label>
                 <Input
                   type="number"
                   step="0.01"
                   value={formData.price}
                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                   placeholder="0.00"
                   required
                   disabled={isLoading}
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Калории
                 </label>
                 <Input
                   type="number"
                   value={formData.calories}
                   onChange={(e) => setFormData({ 
                     ...formData, 
                     calories: parseInt(e.target.value) || 0 
                   })}
                   placeholder="0"
                   disabled={isLoading}
                 />
               </div>
             </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {menuItem ? "Сохранение..." : "Создание..."}
                  </>
                ) : (
                  menuItem ? "Сохранить" : "Создать"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Модальное окно для подтверждения удаления
const DeleteConfirmModal = ({ 
  menuItem, 
  isOpen, 
  onClose, 
  onDelete,
  isLoading
}: { 
  menuItem: MenuItem | null; 
  isOpen: boolean; 
  onClose: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}) => {
  if (!isOpen || !menuItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Удалить пункт меню</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Вы уверены, что хотите удалить &quot;{menuItem.name}&quot;? 
            Это действие нельзя отменить.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Отмена
            </Button>
            <Button 
              onClick={() => onDelete(menuItem.id)} 
              variant="destructive"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    menuItem: MenuItem | null;
  }>({ isOpen: false, menuItem: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    menuItem: MenuItem | null;
  }>({ isOpen: false, menuItem: null });

  // Используем реальный API
  const {
    menuItems,
    isLoading: menuLoading,
    error: menuError,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleActive,
    toggleAvailable,
    isCreating,
    isUpdating,
    isDeleting,
    isTogglingActive,
    isTogglingAvailable
  } = useMenuItems();

  const {
    categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useCategories();

  // Фильтрация пунктов меню
  const filteredMenuItems = menuItems?.filter((item: MenuItem) => {
    const matchesSearch = 
      (typeof item.name === 'string' && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof item.description === 'string' && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Обработчики
  const handleCreateMenuItem = () => {
    setModalState({ isOpen: true, menuItem: null });
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setModalState({ isOpen: true, menuItem });
  };

  const handleDeleteMenuItem = (menuItem: MenuItem) => {
    setDeleteModal({ isOpen: true, menuItem });
  };

  const handleSaveMenuItem = (data: Partial<MenuItem>) => {
    // Transform form data to match API interface - only send allowed properties
    const apiData = {
      name: data.name,
      description: data.description,
      price: data.price, // Keep as number - API expects number
      calories: data.calories
    };

    if (modalState.menuItem) {
      // Редактирование
      updateMenuItem({ menuItemId: modalState.menuItem.id, menuItemData: apiData as Partial<MenuItem> });
    } else {
      // Создание
      createMenuItem(apiData as MenuItem);
    }
    setModalState({ isOpen: false, menuItem: null });
  };

  const handleConfirmDelete = (id: string) => {
    deleteMenuItem(id);
    setDeleteModal({ isOpen: false, menuItem: null });
  };

  // Функция для обновления страницы
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Обработка ошибок
  if (menuError || categoriesError) {
    return (
      <div className="p-6">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ошибка загрузки данных
          </h3>
          <p className="text-gray-500 mb-4">
            {menuError?.message || categoriesError?.message || "Произошла ошибка при загрузке данных"}
          </p>
          <Button onClick={handleRetry}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  const isLoading = menuLoading || categoriesLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Меню</h1>
            <p className="text-gray-600 mt-2">
              Управление пунктами меню
            </p>
          </div>
        </div>
        <Button onClick={handleCreateMenuItem} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Новый пункт меню
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
                         <select
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
               className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             >
               <option value="all">Все категории</option>
                               {(categories || []).map((category: Category, index: number) => (
                  <option key={category?.id || category?.name || `category-${index}`} value={category?.id || ''}>
                    {category?.name || 'Unknown Category'}
                  </option>
                ))}
             </select>
            
                         <div className="flex items-center gap-2">
               <span className="text-sm text-gray-600">
                 Показано: {(filteredMenuItems || []).length} из {(menuItems || []).length}
               </span>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Menu Items List */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(filteredMenuItems || []).map((item: MenuItem, index: number) => (
             <Card key={item?.id || item?.name || `item-${index}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Image */}
                                 <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                   {item.image_url ? (
                     <Image
                       src={item.image_url}
                       alt={item.name}
                       fill
                       className="object-cover"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <ImageIcon className="w-12 h-12 text-gray-400" />
                     </div>
                   )}
                                       <div className="absolute top-2 right-2 flex gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.is_active 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.is_available ? 'Доступно' : 'Недоступно'}
                      </span>
                    </div>
                 </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <div>
                                         <h3 className="text-lg font-semibold text-gray-900 mb-1">
                       {typeof item.name === 'string' ? item.name : 'Без названия'}
                     </h3>
                     <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                       {typeof item.description === 'string' ? item.description : 'Без описания'}
                     </p>
                                         <div className="flex items-center gap-2 text-xs text-gray-500">
                                               <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {typeof item.category === 'object' && item.category?.name ? item.category.name : 'Без категории'}
                        </span>
                                               {item.cooking_time && typeof item.cooking_time === 'number' && (
                          <span className="text-blue-600">
                            {item.cooking_time} мин
                          </span>
                        )}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                                         <div className="flex items-center gap-2">
                       <DollarSign className="w-4 h-4 text-green-600" />
                       <span className="text-gray-600">Цена:</span>
                       <span className="font-semibold">₽{typeof item.price === 'number' ? item.price : 0}</span>
                     </div>
                     
                     {item.calories && typeof item.calories === 'number' && (
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-600">Ккал:</span>
                          <span className="font-semibold">{item.calories}</span>
                        </div>
                      )}
                  </div>
                  
                  
                </div>
                
                                 {/* Toggle Actions */}
                 <div className="flex items-center gap-2 mt-3">
                   <Button
                     variant="outline"
                     size="sm"
                     className={`flex-1 text-xs ${
                       item.is_active 
                         ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                         : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                     }`}
                     onClick={() => toggleActive(item.id)}
                     disabled={isTogglingActive}
                   >
                     {isTogglingActive ? (
                       <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                     ) : (
                       <CheckCircle className="w-3 h-3 mr-1" />
                     )}
                     {item.is_active ? 'Активен' : 'Неактивен'}
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     className={`flex-1 text-xs ${
                       item.is_available 
                         ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                         : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                     }`}
                     onClick={() => toggleAvailable(item.id)}
                     disabled={isTogglingAvailable}
                   >
                     {isTogglingAvailable ? (
                       <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                     ) : (
                       <Package className="w-3 h-3 mr-1" />
                     )}
                     {item.is_available ? 'Доступен' : 'Недоступен'}
                   </Button>
                 </div>

                 {/* Actions */}
                 <div className="flex items-center gap-2 mt-3">
                   <Button
                     variant="outline"
                     size="sm"
                     className="flex-1"
                     onClick={() => handleEditMenuItem(item)}
                     disabled={isUpdating}
                   >
                     <Edit className="w-4 h-4 mr-2" />
                     Изменить
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     className="text-red-600 hover:text-red-700 hover:border-red-300"
                     onClick={() => handleDeleteMenuItem(item)}
                     disabled={isDeleting}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredMenuItems?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || categoryFilter !== "all" 
                ? 'Пункты меню не найдены' 
                : 'Пункты меню отсутствуют'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter !== "all"
                ? 'Попробуйте изменить параметры поиска'
                : 'Создайте первый пункт меню для начала работы'
              }
            </p>
            {!searchQuery && categoryFilter === "all" && (
              <Button onClick={handleCreateMenuItem}>
                <Plus className="w-4 h-4 mr-2" />
                Создать пункт меню
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Модальные окна */}
      <MenuItemModal
        menuItem={modalState.menuItem}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, menuItem: null })}
        onSave={handleSaveMenuItem}
        isLoading={isCreating || isUpdating}
      />
      
      <DeleteConfirmModal
        menuItem={deleteModal.menuItem}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, menuItem: null })}
        onDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
