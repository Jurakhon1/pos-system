"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Products } from "@/entities/product";
import { Category } from "@/shared/types/categories";
import Image from "next/image";

interface ProductCatalogProps {
  products: Products[];
  categories: Category[];
  onAddToCart: (product: Products) => void;
  isLoading: boolean;
}

export const ProductCatalogComponent = ({ 
  products, 
  categories, 
  onAddToCart, 
  isLoading 
}: ProductCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация товаров по категории и поиску
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category.id === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Поиск */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Поиск товаров..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Категории */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            Все
          </Button>
          {categories?.map((category) => {
            const categoryId = parseInt(category.id || "0");
            return (
              <Button
                key={category.id}
                variant={selectedCategory === categoryId ? "default" : "outline"}
                onClick={() => setSelectedCategory(categoryId || null)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Сетка товаров */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => onAddToCart(product)}
                >
                  <CardContent className="p-3">
                    <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs text-center">
                          Нет изображения
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-bold text-green-600">{product.price} ₽</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
