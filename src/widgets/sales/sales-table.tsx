"use client";

import { useState } from "react";
import { Search, Filter, Download, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaleItem {
  id: string;
  time: string;
  orderNumber: string;
  amount: string;
  items: number;
  paymentMethod: string;
  status: string;
}

export function SalesTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const salesData: SaleItem[] = [
    {
      id: "1",
      time: "14:32",
      orderNumber: "#12345",
      amount: "₽ 2,450",
      items: 5,
      paymentMethod: "Карта",
      status: "Оплачен",
    },
    {
      id: "2",
      time: "14:28",
      orderNumber: "#12344",
      amount: "₽ 1,890",
      items: 3,
      paymentMethod: "Наличные",
      status: "Оплачен",
    },
    {
      id: "3",
      time: "14:25",
      orderNumber: "#12343",
      amount: "₽ 3,120",
      items: 7,
      paymentMethod: "Карта",
      status: "Оплачен",
    },
    {
      id: "4",
      time: "14:20",
      orderNumber: "#12342",
      amount: "₽ 890",
      items: 2,
      paymentMethod: "Наличные",
      status: "Оплачен",
    },
    {
      id: "5",
      time: "14:15",
      orderNumber: "#12341",
      amount: "₽ 4,560",
      items: 9,
      paymentMethod: "Карта",
      status: "Оплачен",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Оплачен":
        return "bg-green-100 text-green-800";
      case "В обработке":
        return "bg-yellow-100 text-yellow-800";
      case "Отменен":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Последние продажи</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по заказам..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              Фильтры
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Экспорт
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Время
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Номер заказа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Товары
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Способ оплаты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sale.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {sale.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {sale.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sale.items} шт.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sale.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                    getStatusColor(sale.status)
                  )}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Показано 5 из 1,247 записей
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
              Предыдущая
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-900 bg-blue-100 rounded">
              1
            </span>
            <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
              Следующая
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}