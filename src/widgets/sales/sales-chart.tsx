"use client";

import { BarChart3, Calendar, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function SalesChart() {
  const hourlyData = [
    { hour: "00:00", sales: 12000 },
    { hour: "02:00", sales: 8000 },
    { hour: "04:00", sales: 5000 },
    { hour: "06:00", sales: 3000 },
    { hour: "08:00", sales: 15000 },
    { hour: "10:00", sales: 25000 },
    { hour: "12:00", sales: 35000 },
    { hour: "14:00", sales: 28000 },
    { hour: "16:00", sales: 32000 },
    { hour: "18:00", sales: 40000 },
    { hour: "20:00", sales: 45000 },
    { hour: "22:00", sales: 38000 },
  ];

  const weekdayData = [
    { day: "Пн", sales: 85000 },
    { day: "Вт", sales: 92000 },
    { day: "Ср", sales: 78000 },
    { day: "Чт", sales: 95000 },
    { day: "Пт", sales: 110000 },
    { day: "Сб", sales: 125000 },
    { day: "Вс", sales: 98000 },
  ];

  const maxHourlySales = Math.max(...hourlyData.map(d => d.sales));
  const maxWeekdaySales = Math.max(...weekdayData.map(d => d.sales));

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Продажи по часам</h3>
                <p className="text-sm text-gray-500">Сегодня, 15 декабря 2024</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Экспорт
            </button>
          </div>

          <div className="h-64 flex items-end gap-1">
            {hourlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{
                    height: `${(data.sales / maxHourlySales) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                  {data.hour}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Выручка</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Заказы</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Всего: ₽ 125,430
            </div>
          </div>
        </div>

        {/* Weekday Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Продажи по дням недели</h3>
                <p className="text-sm text-gray-500">За последнюю неделю</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Экспорт
            </button>
          </div>

          <div className="h-64 flex items-end gap-2">
            {weekdayData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                  style={{
                    height: `${(data.sales / maxWeekdaySales) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {data.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Выручка</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Всего: ₽ 693,000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
