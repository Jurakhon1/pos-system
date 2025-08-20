import { useState, useEffect, useCallback } from 'react';
import { kitchenApi, KitchenStation, CreateKitchenStationDto, UpdateKitchenStationDto } from '../api/kitchenApi';

export const useKitchen = () => {
  const [stations, setStations] = useState<KitchenStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all stations
  const fetchStations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await kitchenApi.getStations();
      setStations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stations'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new station
  const createStation = useCallback(async (data: CreateKitchenStationDto) => {
    try {
      setIsCreating(true);
      setError(null);
      const newStation = await kitchenApi.createStation(data);
      setStations(prev => [...prev, newStation]);
      return newStation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create station'));
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Update station
  const updateStation = useCallback(async (id: string, data: UpdateKitchenStationDto) => {
    try {
      setIsUpdating(true);
      setError(null);
      const updatedStation = await kitchenApi.updateStation(id, data);
      setStations(prev => prev.map(station => 
        station.id === id ? updatedStation : station
      ));
      return updatedStation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update station'));
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete station
  const deleteStation = useCallback(async (id: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      await kitchenApi.deleteStation(id);
      setStations(prev => prev.filter(station => station.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete station'));
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Assign menu item to station
  const assignMenuItemToStation = useCallback(async (stationId: string, menuItemId: string) => {
    try {
      setError(null);
      await kitchenApi.assignMenuItemToStation(stationId, menuItemId);
      // Refresh stations to get updated data
      await fetchStations();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to assign menu item'));
      throw err;
    }
  }, [fetchStations]);

  // Load stations on mount
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return {
    stations,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    fetchStations,
    createStation,
    updateStation,
    deleteStation,
    assignMenuItemToStation,
  };
};
