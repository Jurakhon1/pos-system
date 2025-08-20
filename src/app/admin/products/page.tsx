"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
  Calendar,
  XCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/entities/products/hooks/useProducts";
import { CreateProductDto, UpdateProductDto, Product } from "@/entities/products/api/productsApi";

// Модальное окно для создания/редактирования продукта
const ProductModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onSave,
  isLoading
}: { 
  product: Product | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (data: CreateProductDto | UpdateProductDto) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    purchase_price: "",
    category_id: "",
    supplier_id: "",
    barcode: "",
    minimum_stock: "",
    unit: "",
    is_active: true
  });

  // Сброс формы при открытии/закрытии модала
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        sku: product.sku || "",
        purchase_price: product.purchase_price || "",
        category_id: product.category_id || "",
        supplier_id: product.supplier_id || "",
        barcode: product.barcode || "",
        minimum_stock: product.minimum_stock || "",
        unit: product.unit || "",
        is_active: product.is_active
      });
    } else {
      setFormData({
        name: "",
        description: "",
        sku: "",
        purchase_price: "",
        category_id: "",
        supplier_id: "",
        barcode: "",
        minimum_stock: "",
        unit: "",
        is_active: true
      });
    }
  }, [product]);

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
              {product ? "Редактировать продукт" : "Новый продукт"}
            </h2>
            <Button variant="ghost" onClick={onClose} size="sm">
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название продукта *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введите название продукта"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-001"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание продукта"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена закупки *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                  placeholder="0.00"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Минимальный запас *
                </label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.minimum_stock}
                  onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
                  placeholder="0.000"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Единица измерения *
                </label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="кг, шт, л"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID категории *
                </label>
                <Input
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  placeholder="UUID категории"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID поставщика
                </label>
                <Input
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                  placeholder="UUID поставщика"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Штрих-код *
              </label>
              <Input
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="1234567890123"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Активный продукт
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
                    {product ? "Сохранение..." : "Создание..."}
                  </>
                ) : (
                  product ? "Сохранить" : "Создать"
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
  product, 
  isOpen, 
  onClose, 
  onDelete,
  isLoading
}: { 
  product: Product | null; 
  isOpen: boolean; 
  onClose: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Удалить продукт</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Вы уверены, что хотите удалить продукт "{product.name}"? 
            Это действие нельзя отменить.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Отмена
            </Button>
            <Button 
              onClick={() => onDelete(product.id)} 
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

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  // Используем реальный API
  const {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting
  } = useProducts();

  // Фильтрация продуктов
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
      (product.category?.name || 'Без категории') === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === "low") {
      const minStock = parseFloat(product.minimum_stock);
      matchesStock = minStock <= 5;
    } else if (stockFilter === "out") {
      const minStock = parseFloat(product.minimum_stock);
      matchesStock = minStock === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  }) || [];

  // Получение уникальных категорий
  const categories = Array.from(new Set(products?.map(p => 
    p.category?.name || 'Без категории'
  ) || []));

  // Получение цвета для статуса запасов
  const getStockStatusColor = (product: Product) => {
    const minStock = parseFloat(product.minimum_stock);
    if (minStock === 0) return "bg-red-100 text-red-800";
    if (minStock <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Получение текста статуса запасов
  const getStockStatusText = (product: Product) => {
    const minStock = parseFloat(product.minimum_stock);
    if (minStock === 0) return "Нет в наличии";
    if (minStock <= 5) return "Заканчивается";
    return "В наличии";
  };

  // Обработчики
  const handleCreateProduct = () => {
    setModalState({ isOpen: true, product: null });
  };

  const handleEditProduct = (product: Product) => {
    setModalState({ isOpen: true, product });
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleSaveProduct = (data: CreateProductDto | UpdateProductDto) => {
    if (modalState.product) {
      // Редактирование
      updateProduct({ id: modalState.product.id, data });
    } else {
      // Создание
      createProduct(data as CreateProductDto);
    }
    setModalState({ isOpen: false, product: null });
  };

  const handleConfirmDelete = (id: string) => {
    deleteProduct(id);
    setDeleteModal({ isOpen: false, product: null });
  };

  // Обработка ошибок
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ошибка загрузки продуктов
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
            <h1 className="text-3xl font-bold text-gray-900">Продукты</h1>
            <p className="text-gray-600 mt-2">
              Управление продуктами и ингредиентами
            </p>
          </div>
        </div>
        <Button onClick={handleCreateProduct} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Новый продукт
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по названию, описанию или SKU..."
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
              {categories.map((category, i) => (
                <option key={i} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все запасы</option>
              <option value="low">Заканчивается</option>
              <option value="out">Нет в наличии</option>
            </select>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Показано: {filteredProducts.length} из {products?.length || 0}
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

      {/* Products List */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Image placeholder */}
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                      <span className="text-blue-600">
                        {product.category?.name || 'Без категории'}
                      </span>
                      {product.barcode && (
                        <span className="text-xs text-gray-400">
                          Штрих-код: {product.barcode}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Цена:</span>
                      <span className="font-semibold">₽{parseFloat(product.purchase_price)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Запасы:</span>
                      <span className="font-semibold">{parseFloat(product.minimum_stock)} {product.unit}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product)}`}>
                      {getStockStatusText(product)}
                    </span>
                    
                    {product.created_at && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(product.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                  
                  {product.unit && (
                    <div className="text-xs text-gray-500">
                      Единица: {product.unit}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    Поставщик: {product.supplier_id || 'Не указан'}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditProduct(product)}
                    disabled={isUpdating}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Изменить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDeleteProduct(product)}
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
      {!isLoading && filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || categoryFilter !== "all" || stockFilter !== "all" 
                ? 'Продукты не найдены' 
                : 'Продукты отсутствуют'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter !== "all" || stockFilter !== "all"
                ? 'Попробуйте изменить параметры поиска'
                : 'Создайте первый продукт для начала работы'
              }
            </p>
            {!searchQuery && categoryFilter === "all" && stockFilter === "all" && (
              <Button onClick={handleCreateProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Создать продукт
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stock Summary */}
      {!isLoading && products && products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Сводка по запасам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => {
                    const minStock = parseFloat(p.minimum_stock);
                    return minStock > 5;
                  }).length}
                </div>
                <div className="text-sm text-green-700">В наличии</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => {
                    const minStock = parseFloat(p.minimum_stock);
                    return minStock <= 5 && minStock > 0;
                  }).length}
                </div>
                <div className="text-sm text-yellow-700">Заканчивается</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => {
                    const minStock = parseFloat(p.minimum_stock);
                    return minStock === 0;
                  }).length}
                </div>
                <div className="text-sm text-red-700">Нет в наличии</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ₽{products.reduce((sum, p) => {
                    const price = parseFloat(p.purchase_price);
                    const minStock = parseFloat(p.minimum_stock);
                    return sum + (price * minStock);
                  }, 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">Общая стоимость</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Модальные окна */}
      <ProductModal
        product={modalState.product}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, product: null })}
        onSave={handleSaveProduct}
        isLoading={isCreating || isUpdating}
      />
      
      <DeleteConfirmModal
        product={deleteModal.product}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
