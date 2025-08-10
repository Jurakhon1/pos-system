"use client";

import Link from "next/link";

interface CategoryRow {
  id?: number;
  parent?: string;
  name: string;
  count: string;
  selfCost: string;
  revenue: string;
  tax: string;
  profit: string;
  foodCost: string;
  negative?: boolean;
}

export function CategoryTable() {
  const rows: CategoryRow[] = [
    { id: 8, name: "Запеченные роллы", count: "1\u00A0639 шт.", selfCost: "35\u00A0162,25 с", revenue: "108\u00A0814,29 с", tax: "0,00 с", profit: "73\u00A0652,04 с", foodCost: "32,31%" },
    { id: 23, name: "Сеты", count: "356 шт.", selfCost: "4\u00A0908,58 с", revenue: "81\u00A0489,00 с", tax: "0,00 с", profit: "76\u00A0580,42 с", foodCost: "6,02%" },
    { id: 7, name: "Жаренные роллы", count: "1\u00A0215 шт.", selfCost: "18\u00A0968,62 с", revenue: "79\u00A0627,10 с", tax: "0,00 с", profit: "60\u00A0658,48 с", foodCost: "23,82%" },
    { id: 4, name: "Фирменные роллы", count: "939 шт.", selfCost: "21\u00A0898,66 с", revenue: "65\u00A0438,00 с", tax: "0,00 с", profit: "43\u00A0539,34 с", foodCost: "33,46%" },
    { id: 9, name: "Новинки", count: "842 шт.", selfCost: "16\u00A0111,88 с", revenue: "47\u00A0846,81 с", tax: "0,00 с", profit: "31\u00A0734,93 с", foodCost: "33,67%" },
    { id: 5, name: "Напитки", count: "2\u00A0073 шт.", selfCost: "12\u00A0485,02 с", revenue: "38\u00A0913,00 с", tax: "0,00 с", profit: "26\u00A0427,98 с", foodCost: "32,08%" },
    { parent: "Фастфуд", id: 10, name: "Пицца", count: "221 шт.", selfCost: "6\u00A0241,08 с", revenue: "17\u00A0183,00 с", tax: "0,00 с", profit: "10\u00A0941,92 с", foodCost: "36,32%" },
    { id: 16, name: "Суп", count: "185 шт.", selfCost: "4\u00A0168,07 с", revenue: "9\u00A0954,00 с", tax: "0,00 с", profit: "5\u00A0785,93 с", foodCost: "41,87%" },
    { id: 24, name: "Горячие закуски", count: "201 шт.", selfCost: "2\u00A0847,81 с", revenue: "8\u00A0671,00 с", tax: "0,00 с", profit: "5\u00A0823,19 с", foodCost: "32,84%" },
    { parent: "Фастфуд", id: 18, name: "Бургер", count: "229 шт.", selfCost: "3\u00A0319,53 с", revenue: "8\u00A0651,00 с", tax: "0,00 с", profit: "5\u00A0331,47 с", foodCost: "38,37%" },
    { id: 15, name: "Вок", count: "220 шт.", selfCost: "2\u00A0977,96 с", revenue: "8\u00A0093,00 с", tax: "0,00 с", profit: "5\u00A0115,04 с", foodCost: "36,8%" },
    { id: 12, name: "Фастфуд", count: "393 шт.", selfCost: "3\u00A0383,70 с", revenue: "7\u00A0662,00 с", tax: "0,00 с", profit: "4\u00A0278,30 с", foodCost: "44,16%" },
    { id: 22, name: "ДОП", count: "1\u00A0397 шт.", selfCost: "2\u00A0675,99 с", revenue: "3\u00A0939,00 с", tax: "0,00 с", profit: "1\u00A0263,01 с", foodCost: "67,94%" },
    { parent: "Фастфуд", id: 14, name: "Новинки пиццы", count: "46 шт.", selfCost: "1\u00A0274,64 с", revenue: "3\u00A0656,00 с", tax: "0,00 с", profit: "2\u00A0381,36 с", foodCost: "34,86%" },
    { id: 17, name: "Салаты", count: "112 шт.", selfCost: "989,12 с", revenue: "3\u00A0420,00 с", tax: "0,00 с", profit: "2\u00A0430,88 с", foodCost: "28,92%" },
    { id: 6, name: "Мини роллы", count: "100 шт.", selfCost: "1\u00A0189,38 с", revenue: "2\u00A0864,00 с", tax: "0,00 с", profit: "1\u00A0674,62 с", foodCost: "41,53%" },
    { id: 21, name: "Десерт", count: "112 шт.", selfCost: "743,32 с", revenue: "2\u00A0350,00 с", tax: "0,00 с", profit: "1\u00A0606,68 с", foodCost: "31,63%" },
    { id: 25, name: "Суши", count: "32 шт.", selfCost: "150,99 с", revenue: "521,00 с", tax: "0,00 с", profit: "370,01 с", foodCost: "28,98%" },
    { id: 27, name: "КОФЕ", count: "27 шт.", selfCost: "97,56 с", revenue: "459,00 с", tax: "0,00 с", profit: "361,44 с", foodCost: "21,25%" },
    { id: 28, name: "Путь Ниндзя", count: "32 шт.", selfCost: "601,06 с", revenue: "180,29 с", tax: "0,00 с", profit: "−420,77 с", foodCost: "333,39%", negative: true },
  ];

  const totals = {
    count: "10\u00A0371 шт.",
    selfCost: "140\u00A0195,22 с",
    revenue: "499\u00A0731,49 с",
    tax: "0,00 с",
    profit: "359\u00A0536,27 с",
    foodCost: "28,05%",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Категории</th>
              <th className="px-4 py-2 text-right">Кол-во</th>
              <th className="px-4 py-2 text-right">Себестоимость</th>
              <th className="px-4 py-2 text-right">Выручка</th>
              <th className="px-4 py-2 text-right">Сумма налога</th>
              <th className="px-4 py-2 text-right">Прибыль</th>
              <th className="px-4 py-2 text-right">Food cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={`${r.name}-${r.id ?? "noid"}`}>
                <td className="px-4 py-2 text-left max-w-[300px]">
                  <div className="flex flex-wrap items-center gap-1">
                    {r.parent && <span>{r.parent} » </span>}
                    {r.id ? (
                      <Link href={`/manage/dash/category/8-7-2025/8-8-2025/${r.id}`} className="text-blue-600">
                        {r.name}
                      </Link>
                    ) : (
                      <span>{r.name}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-right">{r.count}</td>
                <td className="px-4 py-2 text-right">{r.selfCost}</td>
                <td className="px-4 py-2 text-right">{r.revenue}</td>
                <td className="px-4 py-2 text-right text-gray-400">{r.tax}</td>
                <td className={`px-4 py-2 text-right ${r.negative ? "text-red-600" : ""}`}>{r.profit}</td>
                <td className="px-4 py-2 text-right">{r.foodCost}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2">Итого</td>
              <td className="px-4 py-2 text-right">{totals.count}</td>
              <td className="px-4 py-2 text-right">{totals.selfCost}</td>
              <td className="px-4 py-2 text-right">{totals.revenue}</td>
              <td className="px-4 py-2 text-right text-gray-400">{totals.tax}</td>
              <td className="px-4 py-2 text-right">{totals.profit}</td>
              <td className="px-4 py-2 text-right">{totals.foodCost}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
