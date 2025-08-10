"use client";

import Link from "next/link";

interface ProductRow {
  name: string;
  href: string;
  qty: string;
  gross: string;
  discount: string;
  revenue: string;
  profit: string;
  negative?: boolean;
  zeroDiscount?: boolean;
}

export interface ProductsTableProps {
  search?: string;
  advancedFilter?: string;
}

export function ProductsTable({ search = "", advancedFilter = "" }: ProductsTableProps): JSX.Element {
  const rows: ProductRow[] = [
    { name: "Крафт пакет", href: "/manage/dash/products/8-7-2025/8-8-2025/349", qty: "1\u00A0020 шт.", gross: "2\u00A0040,00 с", discount: "12,00 с", revenue: "2\u00A0028,00 с", profit: "−12,00 с", negative: true },
    { name: "Тэмпура Унаги", href: "/manage/dash/products/8-7-2025/8-8-2025/55", qty: "485 шт.", gross: "33\u00A0465,00 с", discount: "207,00 с", revenue: "33\u00A0258,00 с", profit: "24\u00A0696,83 с" },
    { name: "RC ЖБ 0.33", href: "/manage/dash/products/8-7-2025/8-8-2025/276", qty: "411 шт.", gross: "4\u00A0110,00 с", discount: "50,00 с", revenue: "4\u00A0060,00 с", profit: "2\u00A0220,90 с" },
    { name: "Фри", href: "/manage/dash/products/8-7-2025/8-8-2025/190", qty: "332 шт.", gross: "5\u00A0976,00 с", discount: "54,00 с", revenue: "5\u00A0922,00 с", profit: "3\u00A0404,86 с" },
    { name: "Цезарь тэмпура", href: "/manage/dash/products/8-7-2025/8-8-2025/52", qty: "328 шт.", gross: "19\u00A0352,00 с", discount: "123,90 с", revenue: "19\u00A0228,10 с", profit: "15\u00A0813,07 с" },
    { name: "Филадельфия классик", href: "/manage/dash/products/8-7-2025/8-8-2025/34", qty: "311 шт.", gross: "23\u00A0335,00 с", discount: "225,00 с", revenue: "23\u00A0100,00 с", profit: "14\u00A0775,72 с" },
    { name: "Чикен чиз", href: "/manage/dash/products/8-7-2025/8-8-2025/63", qty: "252 шт.", gross: "14\u00A0616,00 с", discount: "116,00 с", revenue: "14\u00A0500,00 с", profit: "10\u00A0651,20 с" },
    { name: "Эби тэмпура ж", href: "/manage/dash/products/8-7-2025/8-8-2025/51", qty: "251 шт.", gross: "16\u00A0817,00 с", discount: "335,00 с", revenue: "16\u00A0482,00 с", profit: "12\u00A0422,96 с" },
    { name: "Ланч бокс ", href: "/manage/dash/products/8-7-2025/8-8-2025/230", qty: "244 шт.", gross: "1\u00A0220,00 с", discount: "0,00 с", revenue: "1\u00A0220,00 с", profit: "780,80 с", zeroDiscount: true },
    { name: "Мексиканец", href: "/manage/dash/products/8-7-2025/8-8-2025/57", qty: "230 шт.", gross: "18\u00A0860,00 с", discount: "82,00 с", revenue: "18\u00A0778,00 с", profit: "13\u00A0435,34 с" },
    { name: "Мохито стакан", href: "/manage/dash/products/8-7-2025/8-8-2025/218", qty: "227 шт.", gross: "6\u00A0247,00 с", discount: "0,00 с", revenue: "6\u00A0247,00 с", profit: "5\u00A0519,03 с", zeroDiscount: true },
    { name: "Калифорния Грилл", href: "/manage/dash/products/8-7-2025/8-8-2025/56", qty: "212 шт.", gross: "15\u00A0476,00 с", discount: "219,00 с", revenue: "15\u00A0257,00 с", profit: "10\u00A0866,36 с" },
    { name: "RC Cola 1.5L", href: "/manage/dash/products/8-7-2025/8-8-2025/272", qty: "208 шт.", gross: "3\u00A0744,00 с", discount: "0,00 с", revenue: "3\u00A0744,00 с", profit: "1\u00A0848,80 с", zeroDiscount: true },
    { name: "Запеченный краб", href: "/manage/dash/products/8-7-2025/8-8-2025/58", qty: "190 шт.", gross: "8\u00A0550,00 с", discount: "89,99 с", revenue: "8\u00A0460,01 с", profit: "5\u00A0139,30 с" },
    { name: "Оби Зулол Стекло 0.33L", href: "/manage/dash/products/8-7-2025/8-8-2025/345", qty: "155 шт.", gross: "1\u00A0085,00 с", discount: "0,00 с", revenue: "1\u00A0085,00 с", profit: "377,00 с", zeroDiscount: true },
    { name: "Фила с сыром", href: "/manage/dash/products/8-7-2025/8-8-2025/60", qty: "147 шт.", gross: "12\u00A0054,00 с", discount: "0,00 с", revenue: "12\u00A0054,00 с", profit: "7\u00A0910,30 с", zeroDiscount: true },
    { name: "Суши Бургер", href: "/manage/dash/products/8-7-2025/8-8-2025/290", qty: "139 шт.", gross: "9\u00A0591,00 с", discount: "0,00 с", revenue: "9\u00A0591,00 с", profit: "7\u00A0125,05 с", zeroDiscount: true },
    { name: "Ролл-Дог ", href: "/manage/dash/products/8-7-2025/8-8-2025/291", qty: "137 шт.", gross: "8\u00A0083,00 с", discount: "0,00 с", revenue: "8\u00A0083,00 с", profit: "6\u00A0134,07 с", zeroDiscount: true },
    { name: "Том Ям", href: "/manage/dash/products/8-7-2025/8-8-2025/88", qty: "135 шт.", gross: "8\u00A0100,00 с", discount: "0,00 с", revenue: "8\u00A0100,00 с", profit: "4\u00A0591,25 с", zeroDiscount: true },
    { name: "Яки Идзумитай", href: "/manage/dash/products/8-7-2025/8-8-2025/64", qty: "133 шт.", gross: "9\u00A0177,00 с", discount: "0,00 с", revenue: "9\u00A0177,00 с", profit: "5\u00A0846,47 с", zeroDiscount: true },
    { name: "RC Cola Стекло 0.5L", href: "/manage/dash/products/8-7-2025/8-8-2025/269", qty: "125 шт.", gross: "1\u00A0500,00 с", discount: "0,00 с", revenue: "1\u00A0500,00 с", profit: "679,04 с", zeroDiscount: true },
  ];

  const filtered = rows.filter((r) => {
    const matchesSearch = search
      ? r.name.toLowerCase().includes(search.toLowerCase())
      : true;
    let matchesAdvanced = true;
    switch (advancedFilter) {
      case "discount_gt_0":
        matchesAdvanced = r.discount.trim() !== "0,00 с";
        break;
      case "discount_eq_0":
        matchesAdvanced = r.discount.trim() === "0,00 с";
        break;
      case "profit_lt_0":
        matchesAdvanced = !!r.negative;
        break;
      case "tax_eq_0":
        // No tax column in products table; emulate using zeroDiscount as proxy off-state
        matchesAdvanced = true;
        break;
      default:
        matchesAdvanced = true;
    }
    return matchesSearch && matchesAdvanced;
  });

  const totals = {
    qty: "10\u00A0380 шт.",
    gross: "510\u00A0769,00 с",
    discount: "10\u00A0312,51 с",
    revenue: "500\u00A0456,49 с",
    profit: "360\u00A0180,39 с",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Товар</th>
              <th className="px-4 py-2 text-right">Кол-во</th>
              <th className="px-4 py-2 text-right">Валовый оборот</th>
              <th className="px-4 py-2 text-right">Скидка</th>
              <th className="px-4 py-2 text-right">Выручка</th>
              <th className="px-4 py-2 text-right">Прибыль</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((r) => (
              <tr key={r.name}>
                <td className="px-4 py-2 text-left max-w-[280px]">
                  <Link href={r.href} className="text-blue-600">{r.name}</Link>
                </td>
                <td className="px-4 py-2 text-right">{r.qty}</td>
                <td className="px-4 py-2 text-right">{r.gross}</td>
                <td className={"px-4 py-2 text-right " + (r.zeroDiscount ? "text-gray-300" : "")}>{r.discount}</td>
                <td className="px-4 py-2 text-right">{r.revenue}</td>
                <td className={"px-4 py-2 text-right " + (r.negative ? "text-red-600" : "")}>{r.profit}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2">Итого по всем страницам</td>
              <td className="px-4 py-2 text-right">{totals.qty}</td>
              <td className="px-4 py-2 text-right">{totals.gross}</td>
              <td className="px-4 py-2 text-right">{totals.discount}</td>
              <td className="px-4 py-2 text-right">{totals.revenue}</td>
              <td className="px-4 py-2 text-right">{totals.profit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


