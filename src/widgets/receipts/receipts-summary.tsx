"use client";

export function ReceiptsSummary() {
  const metrics = [
    { label: "Оборот", value: "14 877,90 с", strong: true },
    { label: "Наличные", value: "10 523,50 с", strong: true },
    { label: "Карточки", value: "4 354,40 с", strong: true },
    { label: "Сертификаты", value: "0,00 с", muted: true },
    { label: "Онлайн-оплата", value: "0,00 с", muted: true },
    { label: "Скидки", value: "0,00 с", muted: true },
    { label: "Налоги", value: "0,00 с", muted: true },
    { label: "Валовая прибыль", value: "10 991,88 с", strong: true },
  ];

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="text-sm text-gray-700">
            {m.label}
            <strong className="ml-1">
              <span className={m.muted ? "text-gray-300" : "text-gray-900"}>{m.value}</span>
            </strong>
          </div>
        ))}
        <div className="flex-1" />
        <div className="no-print">
          <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Подробнее</button>
        </div>
      </div>
    </div>
  );
}


