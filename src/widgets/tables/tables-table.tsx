"use client";

import Link from "next/link";

interface TableRow {
  name: string;
  guests: number;
  checks: number;
  avgCheck: string;
  turnover: string;
  profit: string;
  link: string;
}

export function TablesTable() {
  const rows: TableRow[] = [
    { name: "—", guests: 1611, checks: 1611, avgCheck: "180,83 с", turnover: "284\u00A0448,61 с", profit: "206\u00A0913,69 с", link: "/manage/dash/table/8-7-2025/8-8-2025/0" },
    { name: "4", guests: 141, checks: 141, avgCheck: "303,17 с", turnover: "42\u00A0443,49 с", profit: "27\u00A0944,38 с", link: "/manage/dash/table/8-7-2025/8-8-2025/4" },
    { name: "1", guests: 154, checks: 154, avgCheck: "277,38 с", turnover: "42\u00A0449,41 с", profit: "27\u00A0308,18 с", link: "/manage/dash/table/8-7-2025/8-8-2025/1" },
    { name: "2", guests: 137, checks: 137, avgCheck: "233,45 с", turnover: "31\u00A0748,72 с", profit: "20\u00A0232,09 с", link: "/manage/dash/table/8-7-2025/8-8-2025/2" },
    { name: "3", guests: 113, checks: 113, avgCheck: "262,06 с", turnover: "29\u00A0612,74 с", profit: "19\u00A0108,22 с", link: "/manage/dash/table/8-7-2025/8-8-2025/3" },
    { name: "7", guests: 87, checks: 87, avgCheck: "289,29 с", turnover: "24\u00A0878,54 с", profit: "16\u00A0409,79 с", link: "/manage/dash/table/8-7-2025/8-8-2025/7" },
    { name: "5", guests: 99, checks: 99, avgCheck: "230,53 с", turnover: "22\u00A0592,34 с", profit: "14\u00A0724,25 с", link: "/manage/dash/table/8-7-2025/8-8-2025/5" },
    { name: "Казино", guests: 71, checks: 71, avgCheck: "332,26 с", turnover: "22\u00A0593,81 с", profit: "14\u00A0691,08 с", link: "/manage/dash/table/8-7-2025/8-8-2025/8" },
    { name: "6", guests: 42, checks: 42, avgCheck: "288,73 с", turnover: "12\u00A0126,82 с", profit: "7\u00A0676,73 с", link: "/manage/dash/table/8-7-2025/8-8-2025/6" },
    { name: "БАР", guests: 32, checks: 32, avgCheck: "99,92 с", turnover: "3\u00A0097,40 с", profit: "2\u00A0038,39 с", link: "/manage/dash/table/8-7-2025/8-8-2025/11" },
    { name: "балкон", guests: 17, checks: 17, avgCheck: "116,17 с", turnover: "1\u00A0742,61 с", profit: "1\u00A01121,06 с", link: "/manage/dash/table/8-7-2025/8-8-2025/10" },
    { name: "балкон", guests: 12, checks: 12, avgCheck: "129,26 с", turnover: "1\u00A0551,10 с", profit: "990,56 с", link: "/manage/dash/table/8-7-2025/8-8-2025/9" },
  ];

  const totals = {
    guests: 2516,
    checks: 2516,
    avgCheck: "228,59 с",
    turnover: "519\u00A0275,59 с",
    profit: "359\u00A0158,42 с",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Название</th>
              <th className="px-4 py-2 text-right">Кол-во гостей</th>
              <th className="px-4 py-2 text-right">Кол-во чеков</th>
              <th className="px-4 py-2 text-right">Средний чек</th>
              <th className="px-4 py-2 text-right">Оборот</th>
              <th className="px-4 py-2 text-right">Прибыль</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r, idx) => (
              <tr key={`${r.name}-${idx}`}>
                <td className="px-4 py-2 text-left text-blue-600">
                  <Link href={r.link}>{r.name}</Link>
                </td>
                <td className="px-4 py-2 text-right max-w-[40px]">{r.guests}</td>
                <td className="px-4 py-2 text-right max-w-[40px]">{r.checks}</td>
                <td className="px-4 py-2 text-right font-semibold">{r.avgCheck}</td>
                <td className="px-4 py-2 text-right font-semibold">{r.turnover}</td>
                <td className="px-4 py-2 text-right font-semibold">{r.profit}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2">Итого</td>
              <td className="px-4 py-2 text-right max-w-[40px]">{totals.guests}</td>
              <td className="px-4 py-2 text-right max-w-[40px]">{totals.checks}</td>
              <td className="px-4 py-2 text-right font-semibold">{totals.avgCheck}</td>
              <td className="px-4 py-2 text-right font-semibold">{totals.turnover}</td>
              <td className="px-4 py-2 text-right font-semibold">{totals.profit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
