"use client";

import { useState } from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReceiptsFilters() {
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isWaiterOpen, setIsWaiterOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isOnlineOpen, setIsOnlineOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dropdown = (open: boolean, onToggle: () => void, label: string, items: string[]) => (
    <div className="relative">
      <button
        className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        onClick={onToggle}
      >
        <span className="mr-1">{label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-72 rounded border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between text-sm text-blue-600">
            <a href="#">Выбрать все</a>
            <a href="#">Очистить</a>
          </div>
          <div className="mb-2">
            <input type="search" placeholder="Поиск..." className="w-full rounded border px-2 py-1 text-sm" />
          </div>
          <div className="max-h-56 overflow-y-auto text-sm">
            {items.map((it) => (
              <div key={it} className="cursor-pointer py-1 hover:bg-gray-100">{it}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
        <button type="submit" className="px-3 text-gray-500" aria-label="search">
          <Search className="h-4 w-4" />
        </button>
        <input className="px-3 py-2 text-sm outline-none" placeholder="Быстрый поиск" />
        <button type="button" className="px-3 text-gray-500" aria-label="reset">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {dropdown(isRiskOpen, () => setIsRiskOpen((v) => !v), "Чеки с риском", [
          "Повторно распечатали пречек",
          "После печати пречека уменьшили сумму заказа",
        ])}

        {dropdown(isShiftOpen, () => setIsShiftOpen((v) => !v), "Смена", ["802 \"Sushi Chef\""])}
        {dropdown(isWaiterOpen, () => setIsWaiterOpen((v) => !v), "Официант", [
          "Shef",
          "Замира",
          "Ситора",
          "Sushi Chef",
        ])}
        {dropdown(isPaymentsOpen, () => setIsPaymentsOpen((v) => !v), "Оплаты", [
          "Наличными",
          "Карточкой",
          "Сертификатом",
          "Депозитом",
          "Бонусами",
          "Без оплаты",
          "Uber Eats",
          "Wolt",
          "Just Eat",
          "Glovo",
          "Алиф",
          "Душанбе Сити",
          "Акрам Банк",
        ])}
        {dropdown(isStatusOpen, () => setIsStatusOpen((v) => !v), "Статус", [
          "Ждёт подтверждения",
          "Открыт",
          "Закрыт",
          "Удален",
          "Отклонённый",
          "Фискальные",
        ])}
        {dropdown(isOnlineOpen, () => setIsOnlineOpen((v) => !v), "Онлайн-заказы", ["Да", "Нет"])}

        <div className="relative">
          <button
            className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setIsFilterOpen((v) => !v)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Фильтр</span>
          </button>
          {isFilterOpen && (
            <div className="absolute z-10 mt-2 w-64 rounded border border-gray-200 bg-white p-3 shadow-lg">
              <div className="mb-2 text-sm">Показать только те, в которых:</div>
              <select className="w-full rounded border bg-white px-2 py-2 text-sm">
                <option value="">Выберите…...</option>
                <option value="tip_gt_0">Есть чаевые</option>
                <option value="discount_gt_0">Есть скидка</option>
                <option value="fiscal_positive">Фискальный чек напечатан</option>
                <option value="fiscal_negative">Фискальный чек не напечатан</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


