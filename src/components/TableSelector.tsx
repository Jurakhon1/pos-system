"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Table, ChevronDown, Users } from "lucide-react";

interface TableSelectorProps {
  tables: Table[];
  selectedTable: string;
  onTableSelect: (tableId: string) => void;
  onTableClear: () => void;
}

export function TableSelector({ tables, selectedTable, onTableSelect, onTableClear }: TableSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTableData = tables.find(table => table.id === selectedTable);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Выберите стол
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedTableData ? (
              <>
                <Table className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  Стол {selectedTableData.number}
                </span>
                <span className="text-sm text-gray-500">
                  ({selectedTableData.capacity} мест)
                </span>
                {selectedTableData.zone && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {selectedTableData.zone}
                  </span>
                )}
              </>
            ) : (
              <>
                <Table className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">Выберите стол</span>
              </>
            )}
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Выпадающий список */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div className="p-2">
                {tables
                  .filter(table => table.is_active)
                  .map((table) => (
                    <button
                      key={table.id}
                      onClick={() => {
                        onTableSelect(table.id);
                        setIsOpen(false);
                      }}
                      className={`w-full p-3 text-left rounded-lg transition-colors hover:bg-gray-50 ${
                        selectedTable === table.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Table className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              Стол {table.number}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              {table.capacity} мест
                              {table.zone && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {table.zone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedTable === table.id && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                
                {tables.filter(table => table.is_active).length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    Нет доступных столов
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Кнопка очистки выбора */}
      {selectedTable && (
        <button
          onClick={onTableClear}
          className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Очистить выбор стола
        </button>
      )}
    </div>
  );
}
