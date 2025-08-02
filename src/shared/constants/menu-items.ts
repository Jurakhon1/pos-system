export interface MenuItem {
  label: string;
  icon: string;
  href: string;
  subItems?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    label: "Статистика",
    icon: "BarChart2",
    href: "/manage/dash/stat/1-8-2025/1-8-2025",
    subItems: [
      { label: "Продажи", href: "/manage/dash/stat/1-8-2025/1-8-2025", icon: "" },
      { label: "Клиенты", href: "/manage/dash/clients", icon: "" },
      { label: "Сотрудники", href: "/manage/dash/waiters", icon: "" },
      { label: "Цехи", href: "/manage/dash/workshops/1-8-2025/1-8-2025", icon: "" },
      { label: "Столы", href: "/manage/dash/tables", icon: "" },
      { label: "Категории", href: "/manage/dash/category", icon: "" },
      { label: "Товары", href: "/manage/dash/products", icon: "" },
      { label: "ABC-анализ", href: "/manage/dash/abc/1-8-2025/1-8-2025", icon: "" },
      { label: "Чеки", href: "/manage/dash/receipts", icon: "" },
      { label: "Отзывы", href: "/manage/dash/feedbacks", icon: "" },
      { label: "Оплаты", href: "/manage/dash/payments", icon: "" },
      { label: "Налоги", href: "/manage/dash/taxes", icon: "" },
    ],
  },
  {
    label: "Финансы",
    icon: "DollarSign",
    href: "/manage/finance/transactions",
    subItems: [
      { label: "Транзакции", href: "/manage/finance/transactions", icon: "" },
      { label: "Cash flow", href: "/manage/finance/cashflow", icon: "" },
      { label: "Кассовые смены", href: "/manage/finance/cash_shift/all/1-7-2025/1-8-2025", icon: "" },
      { label: "Зарплата", href: "/manage/finance/salary", icon: "" },
      { label: "Счета", href: "/manage/finance/accounts", icon: "" },
      { label: "Категории", href: "/manage/finance/categories", icon: "" },
      { label: "P&L", href: "/manage/finance/pnl", icon: "" },
    ],
  },
  {
    label: "Меню",
    icon: "Utensils",
    href: "/manage/menu",
    subItems: [
      { label: "Товары", href: "/manage/menu", icon: "" },
      { label: "Тех. карты", href: "/manage/dishes", icon: "" },
      { label: "Полуфабрикаты", href: "/manage/prepack", icon: "" },
      { label: "Ингредиенты", href: "/manage/ingredients", icon: "" },
      { label: "Категории товаров и тех. карт", href: "/manage/menu/categories_products", icon: "" },
      { label: "Категории ингредиентов", href: "/manage/menu/categories_ingredients", icon: "" },
      { label: "Цехи", href: "/manage/workshops", icon: "" },
    ],
  },
  {
    label: "Склад",
    icon: "Package",
    href: "/manage/calculations",
    subItems: [
      { label: "Остатки", href: "/manage/calculations", icon: "" },
      { label: "Поставки", href: "/manage/calculations/supply", icon: "" },
      { label: "Производства", href: "/manage/calculations/manufacture", icon: "" },
      { label: "Перемещения", href: "/manage/calculations/moving", icon: "" },
      { label: "Списания", href: "/manage/calculations/waste", icon: "" },
      { label: "Отчёт по движению", href: "/manage/calculations/reports", icon: "" },
      { label: "Инвентаризации", href: "/manage/calculations/inventory", icon: "" },
      { label: "Поставщики", href: "/manage/calculations/suppliers", icon: "" },
      { label: "Склады", href: "/manage/calculations/storages", icon: "" },
      { label: "Фасовки", href: "/manage/calculations/packing", icon: "" },
    ],
  },
  {
    label: "Маркетинг",
    icon: "Megaphone",
    href: "/manage/marketing/clients",
    subItems: [
      { label: "Клиенты", href: "/manage/marketing/clients", icon: "" },
      { label: "Группы клиентов", href: "/manage/marketing/groups", icon: "" },
      { label: "Программы лояльности", href: "/manage/marketing/loyalty", icon: "" },
      { label: "Исключения", href: "/manage/marketing/nodiscount", icon: "" },
      { label: "Акции", href: "/manage/marketing/promotions", icon: "" },
    ],
  },
  {
    label: "Доступ",
    icon: "Key",
    href: "/manage/access",
    subItems: [
      { label: "Сотрудники", href: "/manage/access", icon: "" },
      { label: "Должности", href: "/manage/access/role_listing", icon: "" },
      { label: "Кассы", href: "/manage/access/pos", icon: "" },
      { label: "Заведения", href: "/manage/access/places", icon: "" },
      { label: "Интеграции", href: "/manage/access/integration", icon: "" },
    ],
  },
  {
    label: "Все приложения",
    icon: "Grid",
    href: "/manage/applications",
  },
  {
    label: "Настройки",
    icon: "Settings",
    href: "/manage/settings",
    subItems: [
      { label: "Общие", href: "/manage/settings", icon: "" },
      { label: "Оплата подписки", href: "/manage/settings/payments", icon: "" },
      { label: "Заказы", href: "/manage/settings/order_sources", icon: "" },
      { label: "Доставка", href: "/manage/settings/delivery", icon: "" },
      { label: "Столы", href: "/manage/settings/tables", icon: "" },
      { label: "Безопасность", href: "/manage/settings/security", icon: "" },
      { label: "Чек", href: "/manage/settings/receipt", icon: "" },
      { label: "Налоги", href: "/manage/settings/taxes", icon: "" },
    ],
  },
];
