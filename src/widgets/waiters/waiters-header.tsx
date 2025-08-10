"use client";

import Link from "next/link";
import { Download, Printer, Columns } from "lucide-react";

export function WaitersHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Сотрудники</h2>
            <span className="inline-flex items-center justify-center text-sm text-white bg-blue-600 rounded px-2 h-6">4</span>
          </div>
          <ul className="mt-2 flex items-center gap-4 text-sm">
            <li>
              <Link href="/manage/dash/waiters" className="text-blue-600">Официанты</Link>
            </li>
            <li>
              <Link href="/manage/dash/couriers" className="text-gray-500">Курьеры</Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Columns className="w-4 h-4" />
            <span>Столбцы</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Экспорт</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            <span>Печать</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <span>8 июля — 8 августа</span>
          </button>
        </div>
      </div>
    </div>
  );
}
