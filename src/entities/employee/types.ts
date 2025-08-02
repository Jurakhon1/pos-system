export interface Employee {
  id: string;
  name: string;
  revenue: number; // Выручка
  profit: number; // Прибыль
  receiptsCount: number; // Количество чеков
  averageReceipt: number; // Средний чек
  averageTime: string; // Среднее время (например, "50 минут 29 секунд")
  serviceCharge: number; // Процент за обслуживание
}