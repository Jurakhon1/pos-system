"use client";

import { cn } from "@/lib/utils";

interface PaymentMethod {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

export function SalesPaymentMethods() {
  const paymentMethods: PaymentMethod[] = [
    { name: "Наличные", amount: "289\u00A0767,15 с", percentage: 55.88, color: "bg-green-500" },
    { name: "Душанбе Сити", amount: "130\u00A0226,73 с", percentage: 25.11, color: "bg-blue-500" },
    { name: "Алиф", amount: "96\u00A0105,79 с", percentage: 18.53, color: "bg-yellow-500" },
  ];

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold text-gray-900">Методы оплаты</div>
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
          {paymentMethods.map((method) => (
            <div key={method.name} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="text-gray-900">{method.name}</div>
              <div className="flex items-center gap-4">
                <div className="min-w-[160px]">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full", method.color)}
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 w-[60px]">{method.percentage.toFixed(2)}%</div>
                <div className="text-gray-900 whitespace-nowrap">{method.amount}</div>
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
