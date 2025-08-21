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
  XCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/entities/categories/hooks/useCategories";
import { CreateCategoryDto, UpdateCategoryDto } from "@/entities/categories/api/categoriesApi";
import { Category } from "@/entities/categories/api/categoriesApi";

// Модальное окно для создания/редактирования категории
const CategoryModal = ({ 
  category, 
  isOpen, 
  onClose, 
  onSave,
  isLoading
}: { 
  category: Category | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (data: CreateCategoryDto | UpdateCategoryDto) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true
  });

  // Сброс формы при открытии/закрытии модала
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        imageUrl: category.imageUrl || "",
        isActive: category.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isActive: true
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {category ? "Редактировать категорию" : "Новая категория"}
            </h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название категории *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите название категории"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание категории (необязательно)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL изображения
              </label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Активная категория
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {category ? "Сохранение..." : "Создание..."}
                  </>
                ) : (
                  category ? "Сохранить" : "Создать"
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
  category, 
  isOpen, 
  onClose, 
  onDelete,
  isLoading
}: { 
  category: Category; 
  isOpen: boolean; 
  onClose: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Удалить категорию</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Вы уверены, что хотите удалить категорию &quot;{category.name}&quot;? 
            Это действие нельзя отменить.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Отмена
            </Button>
            <Button 
              onClick={() => onDelete(category.id)} 
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

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({ isOpen: false, category: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({ isOpen: false, category: null });

  // Используем реальный API
  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting
  } = useCategories();

  // Фильтрация категорий
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Обработчики
  const handleCreateCategory = () => {
    setModalState({ isOpen: true, category: null });
  };

  const handleEditCategory = (category: Category) => {
    setModalState({ isOpen: true, category });
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteModal({ isOpen: true, category });
  };

  const handleSaveCategory = (data: CreateCategoryDto | UpdateCategoryDto) => {
    if (modalState.category) {
      // Редактирование
      updateCategory({ id: modalState.category.id, data });
    } else {
      // Создание
      createCategory(data as CreateCategoryDto);
    }
    setModalState({ isOpen: false, category: null });
  };

  const handleConfirmDelete = (id: string) => {
    deleteCategory(id);
    setDeleteModal({ isOpen: false, category: null });
  };

  // Обработка ошибок
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ошибка загрузки категорий
          </h3>
          <p className="text-gray-500 mb-4">
            {error.message || "Произошла ошибка при загрузке данных"}
          </p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Категории</h1>
            <p className="text-gray-600 mt-2">
              Управление категориями блюд
            </p>
          </div>
        </div>
        <Button onClick={handleCreateCategory} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Новая категория
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Показано: {filteredCategories.length} из {categories.length}
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

      {/* Categories List */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-400">
                      Создано: {new Date(category.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Изменить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
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
      {!isLoading && filteredCategories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Категории не найдены' : 'Категории отсутствуют'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Попробуйте изменить параметры поиска'
                : 'Создайте первую категорию для начала работы'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateCategory}>
                <Plus className="w-4 h-4 mr-2" />
                Создать категорию
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Модальные окна */}
      <CategoryModal
        category={modalState.category}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, category: null })}
        onSave={handleSaveCategory}
        isLoading={isCreating || isUpdating}
      />
      
      {deleteModal.category && (
        <DeleteConfirmModal
          category={deleteModal.category}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, category: null })}
          onDelete={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
