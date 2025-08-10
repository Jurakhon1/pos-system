"use client";

import { cn } from "@/lib/utils";

interface KpiItem {
  id: string;
  title: string;
  value: string;
}

export function SalesMainKpis() {
  const kpis: KpiItem[] = [
    { id: "revenue", title: "выручка", value: "518\u00A0596,69 с" },
    { id: "profit", title: "прибыль", value: "358\u00A0703,03 с" },
    { id: "transactions", title: "чека", value: "2\u00A0513" },
    { id: "visitors", title: "посетителя", value: "2\u00A0513" },
    { id: "average_receipt", title: "средний чек", value: "210,47 с" },
  ];

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.id} className={cn("flex items-center gap-3 p-3 rounded-lg border", "bg-gray-50 border-gray-200") }>
              <div className="w-8 h-4 bg-gray-300 rounded-sm"></div>
              <div>
                <h4 className="text-base font-semibold text-gray-900">{kpi.value}</h4>
                <div className="text-xs text-gray-600">{kpi.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
