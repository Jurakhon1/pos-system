"use client";

import { cn } from "@/lib/utils";

interface TodayStat {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export function SalesToday() {
  const todayStats: TodayStat[] = [
    { id: "revenue", title: "выручка", value: "7\u00A0182,30 с", change: "-26%", isPositive: false },
    { id: "profit", title: "прибыль", value: "5\u00A0210,90 с", change: "-17%", isPositive: false },
    { id: "transactions", title: "чеков", value: "38", change: "-5%", isPositive: false },
    { id: "visitors", title: "посетителей", value: "38", change: "-5%", isPositive: false },
    { id: "average_receipt", title: "средний чек", value: "194,12 с", change: "-19%", isPositive: false },
  ];

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Сегодня, 8 августа</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {todayStats.map((stat) => (
            <div key={stat.id} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xl font-semibold text-gray-900 flex items-baseline gap-1">
                <span>{stat.value}</span>
                {stat.change && (
                  <span
                    className={cn(
                      "text-xs align-super",
                      stat.isPositive ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <sup>{stat.change}</sup>
                  </span>
                )}
              </h4>
              <div className="text-sm text-gray-600 mt-1">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
