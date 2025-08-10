"use client";

import { cn } from "@/lib/utils";

type Fiscal = "positive" | "negative" | "neutral" | "";

interface ReceiptRow {
  id: number;
  riskHtml?: string; // if present, render tooltip marker
  waiter: string;
  opened: string;
  closed: string;
  paid: string;
  tip: string;
  discount: string;
  profit: string;
  fiscal: Fiscal;
  status: string;
  comment?: string;
}

const rows: ReceiptRow[] = [
  { id: 46062, waiter: "Sushi Chef", opened: "8 августа, 22:05", closed: "", paid: "548,00 с", tip: "0,00 с", discount: "0,00 с", profit: "373,28 с", fiscal: "", status: "Открыт" },
  { id: 46061, waiter: "Sushi Chef", opened: "8 августа, 21:44", closed: "", paid: "538,00 с", tip: "0,00 с", discount: "0,00 с", profit: "358,70 с", fiscal: "", status: "Открыт" },
  { id: 46056, waiter: "Sushi Chef", opened: "8 августа, 21:22", closed: "21:23", paid: "575,00 с", tip: "0,00 с", discount: "0,00 с", profit: "575,00 с", fiscal: "negative", status: "Закрыт" },
];

const aggregate = {
  paid: "14 877,90 с",
  tip: "643,90 с",
  discount: "0,00 с",
  profit: "10 991,88 с",
};

function FiscalBadge({ fiscal }: { fiscal: Fiscal }) {
  if (!fiscal) return <span />;
  const color =
    fiscal === "positive" ? "bg-green-500" : fiscal === "negative" ? "bg-red-500" : "bg-gray-400";
  return <div className={cn("mx-auto h-2 w-2 rounded-full", color)} />;
}

export function ReceiptsTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-600">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 text-center font-medium">Риск</th>
              <th className="px-3 py-2 font-medium">Официант</th>
              <th className="px-3 py-2 font-medium">Открыт</th>
              <th className="px-3 py-2 font-medium">Закрыт</th>
              <th className="px-3 py-2 text-right font-medium">Оплачено</th>
              <th className="px-3 py-2 text-right font-medium">Процент за обслуживание</th>
              <th className="px-3 py-2 text-right font-medium">Скидка в чеке</th>
              <th className="px-3 py-2 text-right font-medium">Прибыль</th>
              <th className="px-3 py-2 text-center font-medium">Фискализация</th>
              <th className="px-3 py-2 font-medium">Статус</th>
              <th className="px-3 py-2 text-center font-medium"></th>
              <th className="px-3 py-2 text-right font-medium"></th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2 text-center">
                  {r.riskHtml ? (
                    <div className="inline-block h-2 w-2 rounded-full bg-orange-400" title={r.riskHtml} />
                  ) : (
                    <span />
                  )}
                </td>
                <td className="px-3 py-2">{r.waiter}</td>
                <td className="px-3 py-2">{r.opened}</td>
                <td className="px-3 py-2">{r.closed}</td>
                <td className="px-3 py-2 text-right font-semibold">{r.paid}</td>
                <td className="px-3 py-2 text-right text-gray-300">{r.tip}</td>
                <td className="px-3 py-2 text-right text-gray-300">{r.discount}</td>
                <td className="px-3 py-2 text-right font-semibold">{r.profit}</td>
                <td className="px-3 py-2 text-center"><FiscalBadge fiscal={r.fiscal} /></td>
                <td className="px-3 py-2">{r.status}</td>
                <td className="px-3 py-2 text-center"></td>
                <td className="px-3 py-2 text-right">
                  <a href="#" className="text-blue-600 hover:underline">Детали</a>
                </td>
                <td className="px-3 py-2"></td>
              </tr>
            ))}
            <tr className="border-t bg-white/50">
              <td className="px-3 py-2" colSpan={5}><strong>Итого</strong></td>
              <td className="px-3 py-2 text-right font-semibold">{aggregate.paid}</td>
              <td className="px-3 py-2 text-right">{aggregate.tip}</td>
              <td className="px-3 py-2 text-right text-gray-300">{aggregate.discount}</td>
              <td className="px-3 py-2 text-right font-semibold">{aggregate.profit}</td>
              <td className="px-3 py-2" colSpan={5}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


