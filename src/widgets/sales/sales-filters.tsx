"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function SalesFilters() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedPlace, setSelectedPlace] = useState("all");

  const periods = [
    { id: "today", label: "Сегодня" },
    { id: "yesterday", label: "Вчера" },
    { id: "week", label: "Неделя" },
    { id: "month", label: "Месяц" },
    { id: "quarter", label: "Квартал" },
    { id: "year", label: "Год" },
  ];

  const places = [
    { id: "all", label: "Все заведения" },
    { id: "place1", label: "Ресторан Центральный" },
    { id: "place2", label: "Кафе Уютное" },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

        {/* Place Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none"
          >
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Filter className="w-4 h-4" />
          Фильтры
        </button>
      </div>
    </div>
  );
}