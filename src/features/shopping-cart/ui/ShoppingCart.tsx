"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CartItem } from "@/entities/cart";
import { TableSelection } from "@/features/table-selection";

interface ShoppingCartProps {
  items: CartItem[];
  total: number;
  selectedTable: number | null;
  onUpdateQuantity: (id: number | string, change: number) => void;
  onRemoveItem: (id: number | string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onTableSelect: (tableNumber: number) => void;
  onTableClear: () => void;
  isCheckoutLoading: boolean;
}

export const ShoppingCartComponent = ({
  items,
  total,
  selectedTable,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onTableSelect,
  onTableClear,
  isCheckoutLoading
}: ShoppingCartProps) => {
  return (
    <div className="bg-white border-l border-gray-200 p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        Корзина
      </h2>

      {/* Выбор стола */}
      <div className="mb-4">
        <TableSelection
          selectedTable={selectedTable}
          onTableSelect={onTableSelect}
          onTableClear={onTableClear}
        />
      </div>

      {/* Товары в корзине */}
      <div className="flex-1 overflow-y-auto max-h-[40vh] mb-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Корзина пуста</p>
        ) : (
                     <div className="space-y-3">
             <AnimatePresence>
               {items.map((item, index) => (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, x: -20, scale: 0.9 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   exit={{ opacity: 0, x: 20, scale: 0.9 }}
                   transition={{ 
                     duration: 0.3, 
                     delay: index * 0.1,
                     type: "spring",
                     stiffness: 300
                   }}
                   className="bg-gray-50 rounded-lg p-3"
                 >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">{item.price} ₽</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        )}
      </div>

      {/* Итого */}
      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Итого:</span>
          <span className="text-green-600">{total} ₽</span>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="space-y-2">
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white active:scale-95 transition-transform"
          disabled={items.length === 0 || isCheckoutLoading}
          onClick={onCheckout}
        >
          {isCheckoutLoading ? 'Создание заказа...' : 'Оформить заказ'}
        </Button>
        <Button
          variant="destructive"
          className="w-full active:scale-95 transition-transform"
          onClick={onClearCart}
          disabled={items.length === 0 || isCheckoutLoading}
        >
          Очистить корзину
        </Button>
      </div>
    </div>
  );
};
