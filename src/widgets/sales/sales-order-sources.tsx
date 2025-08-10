"use client";

import { cn } from "@/lib/utils";

interface OrderSource {
  name: string;
  percentage: number;
  amount: string;
  color: string;
}

export function SalesOrderSources() {
  const sources: OrderSource[] = [
    { name: "В заведении", percentage: 45.25, amount: "234\u00A0641,08 с", color: "bg-blue-500" },
    { name: "Доставка", percentage: 38.22, amount: "198\u00A0196,29 с", color: "bg-purple-500" },
    { name: "Навынос", percentage: 16.54, amount: "85\u00A0759,32 с", color: "bg-green-500" },
  ];

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold text-gray-900">Источники заказов</div>
          <div className="flex items-center gap-2">
            <div className="border rounded-md overflow-hidden">
              <div className="flex">
                <div className="px-3 py-1.5 text-xs bg-blue-600 text-white">Оборот</div>
                <div className="px-3 py-1.5 text-xs bg-white text-gray-700">Чеки</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sources.map((src) => (
            <div key={src.name} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="text-gray-900">{src.name}</div>
              <div className="flex items-center gap-4">
                <div className="min-w-[160px]">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full", src.color)}
                      style={{ width: `${src.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 w-[60px]">{src.percentage.toFixed(2)}%</div>
                <div className="text-gray-900 whitespace-nowrap">{src.amount}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">Показать все</button>
        </div>
      </div>
    </div>
  );
}
