"use client";

import { CalendarRange, Download, Printer } from "lucide-react";

export function SalesHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Статистика продаж</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              8 июля — 8 августа
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Экспорт
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" />
            Печать
          </button>
        </div>
      </div>
    </div>
  );
}