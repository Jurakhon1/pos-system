import { MenuItem } from "@/shared/types/menu";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "stats",
    title: "Статистика",
    icon: "", // Убираем SVG, используем Lucide иконки
    subItems: [
      { id: "sales", title: "Продажи", href: "/manage/dash/stat", isActive: true },
      { id: "clients", title: "Клиенты", href: "/manage/dash/clients" },
      { id: "waiters", title: "Сотрудники", href: "/manage/dash/waiters" },
      { id: "workshops", title: "Цехи", href: "/manage/dash/workshops" },
      { id: "tables", title: "Столы", href: "/manage/dash/tables" },
      { id: "category", title: "Категории", href: "/manage/dash/category" },
      { id: "products", title: "Товары", href: "/manage/dash/products" },
      { id: "abc", title: "ABC-анализ", href: "/manage/dash/abc" },
      { id: "receipts", title: "Чеки", href: "/manage/dash/receipts" },
      { id: "feedbacks", title: "Отзывы", href: "/manage/dash/feedbacks" },
      { id: "payments", title: "Оплаты", href: "/manage/dash/payments" },
      { id: "taxes", title: "Налоги", href: "/manage/dash/taxes" },
    ]
  },
  {
    id: "finance",
    title: "Финансы",
    icon: "",
    subItems: [
      { id: "transactions", title: "Транзакции", href: "/manage/finance/transactions" },
      { id: "cashflow", title: "Cash flow", href: "/manage/finance/cashflow" },
      { id: "cash_shift", title: "Кассовые смены", href: "/manage/finance/cash_shift/all" },
      { id: "salary", title: "Зарплата", href: "/manage/finance/salary" },
      { id: "accounts", title: "Счета", href: "/manage/finance/accounts" },
      { id: "categories", title: "Категории", href: "/manage/finance/categories" },
      { id: "pnl", title: "P&L", href: "/manage/finance/pnl" },
    ]
  },
  {
    id: "menu",
    title: "Меню",
    icon: "",
    subItems: [
      { id: "products", title: "Товары", href: "/manage/menu" },
      { id: "dishes", title: "Тех. карты", href: "/manage/dishes" },
      { id: "prepack", title: "Полуфабрикаты", href: "/manage/prepack" },
      { id: "ingredients", title: "Ингредиенты", href: "/manage/ingredients" },
      { id: "categories_products", title: "Категории товаров и тех. карт", href: "/manage/menu/categories_products" },
      { id: "categories_ingredients", title: "Категории ингредиентов", href: "/manage/menu/categories_ingredients" },
      { id: "workshops", title: "Цехи", href: "/manage/workshops" },
    ]
  },
  {
    id: "warehouse",
    title: "Склад",
    icon: "",
    subItems: [
      { id: "calculations", title: "Остатки", href: "/manage/calculations" },
      { id: "supply", title: "Поставки", href: "/manage/calculations/supply" },
      { id: "manufacture", title: "Производства", href: "/manage/calculations/manufacture" },
      { id: "moving", title: "Перемещения", href: "/manage/calculations/moving" },
      { id: "waste", title: "Списания", href: "/manage/calculations/waste" },
      { id: "reports", title: "Отчёт по движению", href: "/manage/calculations/reports" },
      { id: "inventory", title: "Инвентаризации", href: "/manage/calculations/inventory" },
      { id: "suppliers", title: "Поставщики", href: "/manage/calculations/suppliers" },
      { id: "storages", title: "Склады", href: "/manage/calculations/storages" },
      { id: "packing", title: "Фасовки", href: "/manage/calculations/packing" },
    ]
  },
  {
    id: "marketing",
    title: "Маркетинг",
    icon: "",
    subItems: [
      { id: "clients", title: "Клиенты", href: "/manage/marketing/clients" },
      { id: "groups", title: "Группы клиентов", href: "/manage/marketing/groups" },
      { id: "loyalty", title: "Программы лояльности", href: "/manage/marketing/loyalty" },
      { id: "nodiscount", title: "Исключения", href: "/manage/marketing/nodiscount" },
      { id: "promotions", title: "Акции", href: "/manage/marketing/promotions" },
    ]
  },
  {
    id: "access",
    title: "Доступ",
    icon: "",
    subItems: [
      { id: "employees", title: "Сотрудники", href: "/manage/access" },
      { id: "roles", title: "Должности", href: "/manage/access/role_listing" },
      { id: "pos", title: "Кассы", href: "/manage/access/pos" },
      { id: "places", title: "Заведения", href: "/manage/access/places" },
      { id: "integration", title: "Интеграции", href: "/manage/access/integration" },
    ]
  },
  {
    id: "applications",
    title: "Приложения",
    icon: "",
    subItems: [
      { id: "all", title: "Все приложения", href: "/manage/applications" },
      { id: "print-recipes", title: "Печать тех. карт и полуфабрикатов", href: "/manage/applications/print-my-recipes" },
      { id: "kitchen-kit", title: "Kitchen Kit", href: "/manage/applications/kitchen-kit" },
    ]
  },
  {
    id: "settings",
    title: "Настройки",
    icon: "",
    subItems: [
      { id: "general", title: "Общие", href: "/manage/settings" },
      { id: "payments", title: "Оплата подписки", href: "/manage/settings/payments" },
      { id: "order_sources", title: "Заказы", href: "/manage/settings/order_sources" },
      { id: "delivery", title: "Доставка", href: "/manage/settings/delivery" },
      { id: "tables", title: "Столы", href: "/manage/settings/tables" },
      { id: "security", title: "Безопасность", href: "/manage/settings/security" },
      { id: "receipt", title: "Чек", href: "/manage/settings/receipt" },
      { id: "taxes", title: "Налоги", href: "/manage/settings/taxes" },
    ]
  },
];
