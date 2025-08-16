"use client";

import { motion } from "framer-motion";
import { Plus, Minus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/services/pos";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
    >
      {/* Заголовок товара */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 flex-1 pr-2">
          {item.product.name}
        </h4>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 p-1 transition-colors hover:scale-110"
          title="Удалить товар"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Цена и количество */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-green-600 font-bold text-sm">
          {item.price.toLocaleString('ru-RU')} ₽
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="bg-gray-200 text-gray-700 p-1.5 rounded-lg hover:bg-gray-300 transition-colors hover:scale-105"
            title="Уменьшить количество"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="w-8 text-center font-medium text-gray-900">
            {item.quantity}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="bg-gray-200 text-gray-700 p-1.5 rounded-lg hover:bg-gray-300 transition-colors hover:scale-105"
            title="Увеличить количество"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Итого по товару */}
      <div className="text-right">
        <span className="text-sm text-gray-600">
          Итого: <span className="font-bold text-green-600">{item.total.toLocaleString('ru-RU')} ₽</span>
        </span>
      </div>
    </motion.div>
  );
}
