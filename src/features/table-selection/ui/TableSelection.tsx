"use client";

import { useState, useEffect } from "react";
import { Table } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/entities/auth/hooks/useAuth";

interface TableType {
  id: string;
  number: string;
  location_id: string;
  is_active: boolean;
}

interface TableSelectionProps {
  selectedTable: string | null;
  onTableSelect: (tableId: string) => void;
  onTableClear: () => void;
}

export const TableSelection = ({
  selectedTable,
  onTableSelect,
  onTableClear,
}: TableSelectionProps) => {
  const [tables, setTables] = useState<TableType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getCurrentLocationId } = useAuth();

  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      try {
        const locationId = getCurrentLocationId();
        console.log('🔍 Fetching tables for location:', locationId);
        
        if (!locationId) {
          console.error('❌ No locationId found!');
          setTables([]);
          return;
        }
        const tableApi = {
          getTables: async (locationId: string): Promise<TableType[]> => {
            const response = await fetch(`/api/tables?locationId=${locationId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch tables');
            }
            return response.json();
          }
        };
        const tablesData = await tableApi.getTables(locationId);
        console.log('✅ Loaded tables:', tablesData);
        console.log('📊 Tables count:', tablesData.length);
        
        if (tablesData.length === 0) {
          console.warn('⚠️ No tables found for location:', locationId);
        } else {
          console.log('📋 First table details:', {
            id: tablesData[0].id,
            number: tablesData[0].number,
            location_id: tablesData[0].location_id,
            is_active: tablesData[0].is_active
          });
        }
        
        setTables(tablesData);
      } catch (error) {
        console.error('❌ Failed to fetch tables:', error);
        setTables([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [getCurrentLocationId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Table className="w-4 h-4" />
          Номер стола
        </label>
        <div className="text-sm text-gray-500">Загрузка столов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Table className="w-4 h-4" />
        Номер стола
      </label>
      <div className="flex flex-wrap gap-2">
        {tables.map((table) => (
          <Button
            key={table.id}
            type="button"
            variant={selectedTable === table.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTableSelect(table.id)}
            className="w-12 h-10"
            disabled={!table.is_active}
          >
            {table.number}
          </Button>
        ))}
        {selectedTable && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onTableClear}
            className="w-12 h-10"
          >
            ✕
          </Button>
        )}
      </div>
      {selectedTable && (
        <p className="text-sm text-green-600">
          Выбран стол: {tables.find(t => t.id === selectedTable)?.number}
        </p>
      )}
    </div>
  );
};
