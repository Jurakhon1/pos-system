"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function SalesMainChart() {
  const [mode, setMode] = useState<"day" | "week" | "month">("day");

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Выручка</h4>
          <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
            <button
              className={cn(
                "px-3 py-1.5 text-xs",
                mode === "day" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              )}
              onClick={() => setMode("day")}
            >
              День
            </button>
            <button
              className={cn(
                "px-3 py-1.5 text-xs border-l border-gray-200",
                mode === "week" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              )}
              onClick={() => setMode("week")}
            >
              Неделя
            </button>
            <button
              className={cn(
                "px-3 py-1.5 text-xs border-l border-gray-200",
                mode === "month" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              )}
              onClick={() => setMode("month")}
            >
              Месяц
            </button>
          </div>
        </div>
        <div className="mt-4 h-56 rounded-md bg-[linear-gradient(#f5f5f5_1px,transparent_1px),linear-gradient(90deg,#f5f5f5_1px,transparent_1px)] bg-[size:100%_25%,12.5%_100%]"></div>
      </div>
    </div>
  );
}
