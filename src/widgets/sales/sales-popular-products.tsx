"use client";

export function SalesPopularProducts() {
  const left = [
    { name: "Крафт пакет", orders: "1\u00A0018 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/349" },
    { name: "Тэмпура Унаги", orders: "484 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/55" },
    { name: "RC ЖБ 0.33", orders: "411 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/276" },
    { name: "Фри", orders: "331 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/190" },
  ];
  const right = [
    { name: "Цезарь тэмпура", orders: "327 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/52" },
    { name: "Филадельфия классик", orders: "311 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/34" },
    { name: "Эби тэмпура ж", orders: "251 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/51" },
    { name: "Чикен чиз", orders: "251 шт.", href: "/manage/dash/products/8-7-2025/8-8-2025/63" },
  ];

  const Table = ({ items }: { items: { name: string; orders: string; href: string }[] }) => (
    <div className="table-panel bg-white border border-gray-200 rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Товар</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Заказы</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-t border-gray-200">
              <td className="px-4 py-2 text-sm text-blue-600 hover:underline">
                <a href={item.href}>{item.name}</a>
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Популярные товары</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Table items={left} />
          <Table items={right} />
        </div>
      </div>
    </div>
  );
}
