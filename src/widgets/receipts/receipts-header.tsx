"use client";

import { Columns, Download, Printer, ChevronDown } from "lucide-react";

export function ReceiptsHeader() {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center">
        <h2 className="mr-2 text-2xl font-semibold text-gray-800">Чеки</h2>
        <span className="text-lg text-gray-500">64</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
          <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Columns className="mr-2 h-4 w-4" />
            <span>Столбцы</span>
            <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
          </button>
          <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            <span>Экспорт</span>
            <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
          </button>
          <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Printer className="mr-2 h-4 w-4" />
            <span>Печать</span>
          </button>
        </div>
        <button className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
          <span className="text-gray-700">8 августа</span>
          <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}


