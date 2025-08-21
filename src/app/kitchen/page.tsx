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
  XCircle,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useKitchen } from "@/entities/kitchen";
import { CreateKitchenStationDto, UpdateKitchenStationDto, KitchenStation } from "@/entities/kitchen";

// Enhanced Modal for creating/editing kitchen station
const StationModal = ({ 
  station, 
  isOpen, 
  onClose, 
  onSave,
  isLoading
}: { 
  station: KitchenStation | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (data: CreateKitchenStationDto | UpdateKitchenStationDto) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name,
        description: station.description || "",
        is_active: station.is_active
      });
    } else {
      setFormData({
        name: "",
        description: "",
        is_active: true
      });
    }
  }, [station]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (station) {
      // Update existing station
      onSave({
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      } as UpdateKitchenStationDto);
    } else {
      // Create new station
      onSave({
        location_id: "default", // This should be passed from parent or selected
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      } as CreateKitchenStationDto);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {station ? "Редактировать станцию" : "Новая станция"}
              </h2>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              size="sm"
              className="hover:bg-gray-100 rounded-full"
            >
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Название станции *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Горячий цех, Холодный цех, Бар"
                required
                disabled={isLoading}
                className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Подробное описание станции и её назначения"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                rows={4}
                disabled={isLoading}
              />
            </div>
            
            {/* Active Status */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                Активная станция
              </label>
              <div className="ml-auto">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.is_active ? 'Активна' : 'Неактивна'}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 h-12 text-base font-medium border-gray-200 hover:bg-gray-50" 
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {station ? "Сохранение..." : "Создание..."}
                  </>
                ) : (
                  <>
                    {station ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Сохранить
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Создать
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Enhanced Delete confirmation modal
const DeleteConfirmModal = ({ 
  station, 
  isOpen, 
  onClose, 
  onDelete,
  isLoading
}: { 
  station: KitchenStation | null; 
  isOpen: boolean; 
  onClose: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}) => {
  if (!isOpen || !station) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Удалить станцию</h2>
              <p className="text-sm text-gray-500">Это действие нельзя отменить</p>
            </div>
          </div>
          
          {/* Warning Message */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Внимание!</p>
                <p>Вы собираетесь удалить станцию <strong>&quot;{station.name}&quot;</strong>. Все связанные данные будут потеряны.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12 text-base font-medium border-gray-200 hover:bg-gray-50" 
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button 
              onClick={() => onDelete(station.id)} 
              variant="destructive"
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5 mr-2" />
                  Удалить
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function KitchenPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "created" | "status">("name");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    station: KitchenStation | null;
  }>({ isOpen: false, station: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    station: KitchenStation | null;
  }>({ isOpen: false, station: null });

  const {
    stations,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    createStation,
    updateStation,
    deleteStation
  } = useKitchen();

  // Enhanced filtering and sorting
  const filteredAndSortedStations = stations
    .filter(station =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (station.description && station.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "status":
          return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
        default:
          return 0;
      }
    });

  // Handlers
  const handleCreateStation = () => {
    setModalState({ isOpen: true, station: null });
  };

  const handleEditStation = (station: KitchenStation) => {
    setModalState({ isOpen: true, station });
  };

  const handleDeleteStation = (station: KitchenStation) => {
    setDeleteModal({ isOpen: true, station });
  };

  const handleSaveStation = async (data: CreateKitchenStationDto | UpdateKitchenStationDto) => {
    try {
      if (modalState.station) {
        await updateStation(modalState.station.id, data as UpdateKitchenStationDto);
      } else {
        const createData = data as CreateKitchenStationDto;
        createData.location_id = "default-location-id";
        await createStation(createData);
      }
      setModalState({ isOpen: false, station: null });
    } catch (error) {
      console.error('Failed to save station:', error);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteStation(id);
      setDeleteModal({ isOpen: false, station: null });
    } catch (error) {
      console.error('Failed to delete station:', error);
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ошибка загрузки данных
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {error.message || "Произошла ошибка при загрузке данных"}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3 text-lg"
            >
              Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-gray-100 rounded-full p-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Кухня
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Управление кухонными станциями и рабочими процессами
                </p>
              </div>
            </div>
            <Button 
              onClick={handleCreateStation} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3 text-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Новая станция
            </Button>
          </div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Поиск по названию или описанию станции..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
              >
                <Package className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as "name" | "created" | "status")}
              className="h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="name">По названию</option>
              <option value="created">По дате создания</option>
              <option value="status">По статусу</option>
            </select>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="hidden sm:inline">
                Показано: <strong>{filteredAndSortedStations.length}</strong> из <strong>{stations.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Загрузка станций...</p>
            </div>
          </div>
        )}

        {/* Enhanced Stations Display */}
        {!isLoading && (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredAndSortedStations.map((station) => (
                  <Card key={station.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-2xl overflow-hidden border-0 shadow-lg">
                    <CardContent className="p-0">
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                              <Package className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">{station.name}</h3>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                station.is_active 
                                  ? 'bg-green-500/20 text-green-100' 
                                  : 'bg-gray-500/20 text-gray-100'
                              }`}>
                                {station.is_active ? 'Активна' : 'Неактивна'}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20 rounded-full"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {station.description && (
                          <p className="text-gray-600 line-clamp-2 leading-relaxed">
                            {station.description}
                          </p>
                        )}
                        
                        {/* Enhanced Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                            <Package className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-500">Меню</p>
                              <p className="font-semibold text-blue-900">
                                {station.menuItems?.length || 0}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                            <Clock className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Создана</p>
                              <p className="font-semibold text-green-900">
                                {new Date(station.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl font-medium"
                            onClick={() => handleEditStation(station)}
                            disabled={isUpdating}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Изменить
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-xl"
                            onClick={() => handleDeleteStation(station)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredAndSortedStations.map((station) => (
                  <Card key={station.id} className="group hover:shadow-lg transition-all duration-200 bg-white rounded-xl border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {station.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              station.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {station.is_active ? 'Активна' : 'Неактивна'}
                            </span>
                          </div>
                          
                          {station.description && (
                            <p className="text-gray-600 line-clamp-2 mb-3">
                              {station.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {station.menuItems?.length || 0} меню
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(station.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg"
                            onClick={() => handleEditStation(station)}
                            disabled={isUpdating}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Изменить
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-lg"
                            onClick={() => handleDeleteStation(station)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Enhanced Empty State */}
        {!isLoading && filteredAndSortedStations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery 
                ? 'Станции не найдены' 
                : 'Кухонные станции отсутствуют'
              }
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {searchQuery
                ? 'Попробуйте изменить параметры поиска или создать новую станцию'
                : 'Создайте первую кухонную станцию для начала работы с системой'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={handleCreateStation}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3 text-lg font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Создать станцию
              </Button>
            )}
          </div>
        )}

        {/* Modals */}
        <StationModal
          station={modalState.station}
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, station: null })}
          onSave={handleSaveStation}
          isLoading={isCreating || isUpdating}
        />
        
        <DeleteConfirmModal
          station={deleteModal.station}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, station: null })}
          onDelete={handleConfirmDelete}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
