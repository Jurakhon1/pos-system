"use client";

import Link from "next/link";

interface WorkshopRow {
  name: string;
  countPcs: string;
  countWeight: string;
  revenue: string;
  cost: string;
  profit: string;
  link: string;
}

export function WorkshopsTable() {
  const rows: WorkshopRow[] = [
    {
      name: "Кухня",
      countPcs: "7\u00A0109,00 шт.",
      countWeight: "0,000 кг",
      revenue: "447\u00A0512,49 с",
      cost: "125\u00A0264,23 с",
      profit: "322\u00A0248,26 с",
      link: "/manage/dash/workshop/8-7-2025/8-8-2025/2",
    },
    {
      name: "Бар",
      countPcs: "3\u00A0193,00 шт.",
      countWeight: "0,000 кг",
      revenue: "42\u00A0498,00 с",
      cost: "14\u00A0837,84 с",
      profit: "27\u00A0660,16 с",
      link: "/manage/dash/workshop/8-7-2025/8-8-2025/1",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Цех</th>
              <th className="px-4 py-2 text-right">Поштучные товары и тех. карты</th>
              <th className="px-4 py-2 text-right">Весовые</th>
              <th className="px-4 py-2 text-right">Выручка</th>
              <th className="px-4 py-2 text-right">Себестоимость</th>
              <th className="px-4 py-2 text-right">Прибыль</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="px-4 py-2 text-left text-blue-600">
                  <Link href={r.link}>{r.name}</Link>
                </td>
                <td className="px-4 py-2 text-right max-w-[200px]">{r.countPcs}</td>
                <td className="px-4 py-2 text-right">{r.countWeight}</td>
                <td className="px-4 py-2 text-right">{r.revenue}</td>
                <td className="px-4 py-2 text-right">{r.cost}</td>
                <td className="px-4 py-2 text-right">{r.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
