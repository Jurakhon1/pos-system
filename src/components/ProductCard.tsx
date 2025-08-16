"use client";

import { motion } from "framer-motion";
import { Plus, UtensilsCrossed } from "lucide-react";
import type { Product } from "@/services/pos";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onAddToCart, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Изображение товара */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center relative group">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <UtensilsCrossed className="w-16 h-16 text-gray-400" />
        )}
        
        {/* Overlay с кнопкой добавления */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-blue-700 transition-all duration-200 transform scale-90 group-hover:scale-100"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Информация о товаре */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          
          {/* Кнопка добавления (видна всегда) */}
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 hover:scale-105"
            title="Добавить в корзину"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
