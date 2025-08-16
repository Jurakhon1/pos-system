"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Table, Hash } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface TableSelectionProps {
  selectedTable: number | null;
  onTableSelect: (tableNumber: number) => void;
  onTableClear: () => void;
}

export const TableSelectionComponent = ({
  selectedTable,
  onTableSelect,
  onTableClear
}: TableSelectionProps) => {
  const [customTable, setCustomTable] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Предустановленные номера столов
  const presetTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleCustomTableSubmit = () => {
    const tableNum = parseInt(customTable);
    if (tableNum > 0) {
      onTableSelect(tableNum);
      setCustomTable("");
      setShowCustomInput(false);
    }
  };

  const handleTableSelect = (tableNumber: number) => {
    if (selectedTable === tableNumber) {
      onTableClear();
    } else {
      onTableSelect(tableNumber);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Выбор стола</h3>
      </div>

      {/* Выбранный стол */}
      {selectedTable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              Стол №{selectedTable}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onTableClear}
              className="text-blue-600 hover:text-blue-800"
            >
              Изменить
            </Button>
          </div>
        </motion.div>
      )}

      {/* Предустановленные столы */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {presetTables.map((tableNumber) => (
          <motion.div
            key={tableNumber}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedTable === tableNumber ? "default" : "outline"}
              size="sm"
              onClick={() => handleTableSelect(tableNumber)}
              className="w-full h-10"
            >
              {tableNumber}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Кастомный номер стола */}
      <div className="flex gap-2">
        {!showCustomInput ? (
          <Button
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="flex-1"
          >
            <Hash className="w-4 h-4 mr-2" />
            Другой номер
          </Button>
        ) : (
          <div className="flex gap-2 flex-1">
            <Input
              type="number"
              placeholder="Номер стола"
              value={customTable}
              onChange={(e) => setCustomTable(e.target.value)}
              min="1"
              className="flex-1"
            />
            <Button
              onClick={handleCustomTableSubmit}
              disabled={!customTable || parseInt(customTable) <= 0}
              size="sm"
            >
              OK
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomInput(false);
                setCustomTable("");
              }}
              size="sm"
            >
              Отмена
            </Button>
          </div>
        )}
      </div>

      {/* Подсказка */}
      <p className="text-xs text-gray-500 mt-2">
        Выберите номер стола для заказа. Если стол не выбран, заказ будет создан без привязки к столу.
      </p>
    </div>
  );
};
