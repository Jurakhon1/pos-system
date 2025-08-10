"use client";

import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AbcFilters() {
  const [isPlaceOpen, setIsPlaceOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const places = ["Sushi Chef"];
  const groups = ["Все", "A", "B", "C"];
  const advancedFilterOptions = [
    { value: "discount_gt_0", label: "Есть скидка" },
    { value: "discount_eq_0", label: "Без скидки" },
    { value: "profit_lt_0", label: "Прибыль отрицательная" },
    { value: "tax_eq_0", label: "Налог 0" },
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
        <button type="submit" className="px-3 text-gray-500" aria-label="search">
          <Search className="h-4 w-4" />
        </button>
        <input className="px-3 py-2 text-sm outline-none" placeholder="Быстрый поиск" />
        <button type="button" className="px-3 text-gray-500" aria-label="reset">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Заведение */}
      <div className="relative">
        <button
          className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          onClick={() => setIsPlaceOpen((v) => !v)}
        >
          <span className="mr-1">Заведение</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isPlaceOpen && "rotate-180")} />
        </button>
        {isPlaceOpen && (
          <div className="absolute z-10 mt-2 w-64 rounded border border-gray-200 bg-white p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between text-sm text-blue-600">
              <a href="#">Выбрать все</a>
              <a href="#">Очистить</a>
            </div>
            <ul className="max-h-48 overflow-y-auto text-sm">
              {places.map((place) => (
                <li key={place} className="cursor-pointer py-1 hover:bg-gray-100">{place}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Группа */}
      <div className="relative">
        <button
          className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          onClick={() => setIsGroupOpen((v) => !v)}
        >
          <span className="mr-1">Группа</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isGroupOpen && "rotate-180")} />
        </button>
        {isGroupOpen && (
          <div className="absolute z-10 mt-2 w-64 rounded border border-gray-200 bg-white p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between text-sm text-blue-600">
              <a href="#">Выбрать все</a>
              <a href="#">Очистить</a>
            </div>
            <ul className="max-h-48 overflow-y-auto text-sm">
              {groups.map((group) => (
                <li key={group} className="cursor-pointer py-1 hover:bg-gray-100">{group}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Фильтр */}
      <div className="relative">
        <button
          className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          onClick={() => setIsFilterOpen((v) => !v)}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Фильтр</span>
        </button>
        {isFilterOpen && (
          <div className="absolute z-10 mt-2 w-64 rounded border border-gray-200 bg-white p-3 shadow-lg">
            <div className="mb-2 text-sm">Показать только те, в которых:</div>
            <select className="w-full rounded border bg-white px-2 py-2 text-sm">
              <option value="">Выберите…...</option>
              {advancedFilterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}


