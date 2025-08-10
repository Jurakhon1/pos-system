"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface RowData {
  id: number;
  name: string;
  href: string;
  qty: string;
  qtyPct: string;
  sum: string;
  sumPct: string;
  profit: string;
  profitPct: string;
  abcQty: "A" | "B" | "C";
  abcSum: "A" | "B" | "C";
  abcProfit: "A" | "B" | "C";
}

const sampleRows: RowData[] = [
  {
    id: 1,
    name: "RC Cola Стекло 0.5L",
    href: "/manage/dash/products/8-7-2025/8-8-2025/269",
    qty: "125 шт.",
    qtyPct: "1.25%",
    sum: "1 500,00 с",
    sumPct: "0.30%",
    profit: "679,04 с",
    profitPct: "0.19%",
    abcQty: "A",
    abcSum: "A",
    abcProfit: "A",
  },
  {
    id: 25,
    name: "Острый Лосось",
    href: "/manage/dash/products/8-7-2025/8-8-2025/330",
    qty: "53 шт.",
    qtyPct: "0.53%",
    sum: "3 127,00 с",
    sumPct: "0.62%",
    profit: "−298,98 с",
    profitPct: "−0.08%",
    abcQty: "A",
    abcSum: "A",
    abcProfit: "C",
  },
  {
    id: 262,
    name: "Эспрессо",
    href: "/manage/dash/products/8-7-2025/8-8-2025/262",
    qty: "2 шт.",
    qtyPct: "0.02%",
    sum: "20,00 с",
    sumPct: "0.00%",
    profit: "13,40 с",
    profitPct: "0.00%",
    abcQty: "C",
    abcSum: "C",
    abcProfit: "C",
  },
];

function badgeClasses(letter: "A" | "B" | "C") {
  const base = "inline-flex h-6 w-6 items-center justify-center rounded font-bold";
  if (letter === "A") return cn(base, "bg-red-100 text-red-600");
  if (letter === "B") return cn(base, "bg-yellow-100 text-yellow-700");
  return cn(base, "bg-green-100 text-green-700");
}

export function AbcTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-600">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Товар</th>
              <th className="px-3 py-2 text-right font-medium">Кол-во</th>
              <th className="px-3 py-2 text-right font-medium">% кол-ва</th>
              <th className="px-3 py-2 text-right font-medium">Сумма</th>
              <th className="px-3 py-2 text-right font-medium">% суммы</th>
              <th className="px-3 py-2 text-right font-medium">Прибыль</th>
              <th className="px-3 py-2 text-right font-medium">% прибыли</th>
              <th className="px-3 py-2 text-center font-medium">ABC по кол-ву</th>
              <th className="px-3 py-2 text-center font-medium">ABC по сумме</th>
              <th className="px-3 py-2 text-center font-medium">ABC по прибыли</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sampleRows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{row.id}</td>
                <td className="px-3 py-2 text-blue-600">
                  <Link href={row.href} className="hover:underline">
                    {row.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-right">{row.qty}</td>
                <td className="px-3 py-2 text-right">{row.qtyPct}</td>
                <td className="px-3 py-2 text-right">{row.sum}</td>
                <td className="px-3 py-2 text-right">{row.sumPct}</td>
                <td className="px-3 py-2 text-right">{row.profit}</td>
                <td className="px-3 py-2 text-right">{row.profitPct}</td>
                <td className="px-3 py-2 text-center">
                  <span className={badgeClasses(row.abcQty)}>{row.abcQty}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={badgeClasses(row.abcSum)}>{row.abcSum}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={badgeClasses(row.abcProfit)}>{row.abcProfit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


