"use client";

import Link from "next/link";

interface ClientRow {
  name: string;
  phone: string;
  createdAt: string;
  sumNoDiscount: string;
  delivery: string;
  cash: string;
  card: string;
  bonus: string;
  certificate: string;
  deposit: string;
  profit: string;
  checks: string;
  avgCheck: string;
  lastCheck: string;
  birthday: string;
  link: string;
}

export function ClientsTable() {
  const rows: ClientRow[] = [
    {
      name: "CHEF",
      phone: "",
      createdAt: "15 мая 2023",
      sumNoDiscount: "118,00 с",
      delivery: "0,00 с",
      cash: "112,10 с",
      card: "0,00 с",
      bonus: "0,00 с",
      certificate: "0,00 с",
      deposit: "0,00 с",
      profit: "91,27 с",
      checks: "1 шт.",
      avgCheck: "118,00 с",
      lastCheck: "21 июля, 19:01",
      birthday: "",
      link: "/manage/dash/clients/8-7-2025/8-8-2025/1",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Клиент</th>
              <th className="px-4 py-2 text-left">Телефон</th>
              <th className="px-4 py-2 text-left">Дата создания</th>
              <th className="px-4 py-2 text-right">Без скидки</th>
              <th className="px-4 py-2 text-right">Доставка</th>
              <th className="px-4 py-2 text-right">Наличными</th>
              <th className="px-4 py-2 text-right">Карточкой</th>
              <th className="px-4 py-2 text-right">Бонусами</th>
              <th className="px-4 py-2 text-right">Сертификатом</th>
              <th className="px-4 py-2 text-right">Депозитом</th>
              <th className="px-4 py-2 text-right">Прибыль</th>
              <th className="px-4 py-2 text-right">Чеки</th>
              <th className="px-4 py-2 text-right">Средний чек</th>
              <th className="px-4 py-2 text-left">Дата последнего чека</th>
              <th className="px-4 py-2 text-left">Дата рождения</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="px-4 py-2 text-blue-600 max-w-[200px] truncate">
                  <Link href={r.link}>CHEF</Link>
                </td>
                <td className="px-4 py-2 max-w-[150px] truncate">{r.phone}</td>
                <td className="px-4 py-2">{r.createdAt}</td>
                <td className="px-4 py-2 text-right">{r.sumNoDiscount}</td>
                <td className="px-4 py-2 text-right text-gray-400">{r.delivery}</td>
                <td className="px-4 py-2 text-right">{r.cash}</td>
                <td className="px-4 py-2 text-right text-gray-400">{r.card}</td>
                <td className="px-4 py-2 text-right text-gray-400">{r.bonus}</td>
                <td className="px-4 py-2 text-right text-gray-400">{r.certificate}</td>
                <td className="px-4 py-2 text-right text-gray-400">{r.deposit}</td>
                <td className="px-4 py-2 text-right">{r.profit}</td>
                <td className="px-4 py-2 text-right">{r.checks}</td>
                <td className="px-4 py-2 text-right">{r.avgCheck}</td>
                <td className="px-4 py-2">{r.lastCheck}</td>
                <td className="px-4 py-2">{r.birthday}</td>
              </tr>
            ))}
            {/* Aggregate */}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2" colSpan={3}>Итого</td>
              <td className="px-4 py-2 text-right">118,00 с</td>
              <td className="px-4 py-2 text-right text-gray-400">0,00 с</td>
              <td className="px-4 py-2 text-right">112,10 с</td>
              <td className="px-4 py-2 text-right text-gray-400">0,00 с</td>
              <td className="px-4 py-2 text-right text-gray-400">0,00 с</td>
              <td className="px-4 py-2 text-right text-gray-400">0,00 с</td>
              <td className="px-4 py-2 text-right text-gray-400">0,00 с</td>
              <td className="px-4 py-2 text-right">91,27 с</td>
              <td className="px-4 py-2 text-right">1 шт.</td>
              <td className="px-4 py-2 text-right">118,00 с</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
