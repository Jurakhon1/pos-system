import { useState, useEffect } from 'react';
import { tableApi } from '../api/tableApi';

interface Table {
  id: string;
  number: number;
  capacity: number;
  is_active: boolean;
  location_id: string;
}

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tableApi.getTables();
      setTables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке столов');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTableStatus = async (tableId: string, status: Table['is_active']) => {
    try {
      setError(null);
      const updatedTable = await tableApi.updateTableStatus(tableId, status);
      setTables(prev => prev.map(table => 
        table.id === tableId ? updatedTable : table
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при обновлении статуса стола');
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    isLoading,
    error,
    fetchTables,
    updateTableStatus
  };
};
