"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export function CategoryFilters() {
  const [search, setSearch] = useState("");

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          className="pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Быстрый поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <span>Категории</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Фильтр</button>
      </div>
    </div>
  );
}
