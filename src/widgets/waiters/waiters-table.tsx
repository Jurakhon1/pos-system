"use client";

import Link from "next/link";

interface WaiterRow {
  name: string;
  revenue: string;
  profit: string;
  checks: string;
  avgCheck: string;
  avgTime: string;
  service: string;
  link: string;
  gray?: boolean;
}

export function WaitersTable() {
  const rows: WaiterRow[] = [
    {
      name: "Shef",
      revenue: "0,00 с",
      profit: "0,00 с",
      checks: "0 шт.",
      avgCheck: "0,00 с",
      avgTime: "0 секунд",
      service: "0,00 с",
      link: "/manage/dash/waiters/8-7-2025/7-8-2025/5",
      gray: true,
    },
    {
      name: "Sushi Chef",
      revenue: "515\u00A0198,19 с",
      profit: "356\u00A0421,03 с",
      checks: "2494 шт.",
      avgCheck: "210,72 с",
      avgTime: "52 минуты 12 секунд",
      service: "19\u00A0846,70 с",
      link: "/manage/dash/waiters/8-7-2025/7-8-2025/4",
    },
    {
      name: "Замира",
      revenue: "0,00 с",
      profit: "0,00 с",
      checks: "0 шт.",
      avgCheck: "0,00 с",
      avgTime: "0 секунд",
      service: "0,00 с",
      link: "/manage/dash/waiters/8-7-2025/7-8-2025/6",
      gray: true,
    },
    {
      name: "Ситора",
      revenue: "3\u00A0891,50 с",
      profit: "2\u00A0624,51 с",
      checks: "21 шт.",
      avgCheck: "185,31 с",
      avgTime: "72 минуты 21 секунда",
      service: "151,50 с",
      link: "/manage/dash/waiters/8-7-2025/7-8-2025/7",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Официант</th>
              <th className="px-4 py-2 text-right">Выручка</th>
              <th className="px-4 py-2 text-right">Прибыль</th>
              <th className="px-4 py-2 text-right">Чеки</th>
              <th className="px-4 py-2 text-right">Средний чек</th>
              <th className="px-4 py-2 text-right">Среднее время</th>
              <th className="px-4 py-2 text-right">Процент за обслуживание</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.name} className={r.gray ? "text-gray-400" : undefined}>
                <td className="px-4 py-2 text-left text-blue-600">
                  <Link href={r.link}>{r.name}</Link>
                </td>
                <td className="px-4 py-2 text-right">{r.revenue}</td>
                <td className="px-4 py-2 text-right">{r.profit}</td>
                <td className="px-4 py-2 text-right">{r.checks}</td>
                <td className="px-4 py-2 text-right">{r.avgCheck}</td>
                <td className="px-4 py-2 text-right">{r.avgTime}</td>
                <td className="px-4 py-2 text-right">{r.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
