'use client';

import { useState } from 'react';
import { Header } from '@/features/header';
import { TodayStats } from '@/features/today-stats';
import { MainChart } from '@/features/main-chart';
import { StatsWidgets } from '@/features/stats-widgets';
import { HourlyStats } from '@/features/hourly-stats';
import { WeekdayStats } from '@/features/weekday-stats';
import { PopularProducts } from '@/features/popular-products';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const headerProps = {
    title: 'Статистика продаж',
    dateStart: '2025-07-01',
    dateEnd: '2025-08-01',
    timeStart: 0,
    timeEnd: 23,
    timezoneShift: 5,
    onExport: () => console.log('Export clicked'),
    onPrint: () => console.log('Print clicked'),
    onMenuToggle: () => setIsSidebarOpen(!isSidebarOpen),
  };

  const todayStatsData = {
    date: '1 августа',
    stats: [
      { label: 'выручка', value: 1882.7, percentage: 24, unit: 'с' },
      { label: 'прибыль', value: 1221.53, percentage: 17, unit: 'с' },
      { label: 'чеков', value: 13, percentage: 23 },
      { label: 'посетителей', value: 13, percentage: 23 },
      { label: 'средний чек', value: 144.82, percentage: 1, unit: 'с' },
    ],
  };

  const mainChartData = {
    data: [
      14468, 15223, 18755, 12495, 16189, 19851, 14951, 13678, 12190, 8499, 14187, 18649, 21254,
      16030, 13683, 14843, 19537, 16313, 16929, 20524, 16520, 16436, 13308, 11277, 14126, 16178,
      22773, 14612, 16324, 22019, 14698, 1883,
    ],
    labels: Array.from({ length: 31 }, (_, i) => `${i + 1} июля`),
  };

  const hourlyStatsData = {
    data: Array(24).fill(0).map(() => Math.floor(Math.random() * 1000)),
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  };

  const weekdayStatsData = {
    data: [12000, 15000, 13000, 14000, 16000, 17000, 11000],
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  };

  const popularProductsData = {
    products: [
      [
        { name: 'Крафт пакет', orders: '1 010 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/349' },
        { name: 'Тэмпура Унаги', orders: '450 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/55' },
        { name: 'RC ЖБ 0.33', orders: '371 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/276' },
        { name: 'Фри', orders: '332 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/190' },
      ],
      [
        { name: 'Цезарь тэмпура', orders: '321 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/52' },
        { name: 'Филадельфия классик', orders: '306 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/34' },
        { name: 'Чикен чиз', orders: '266 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/63' },
        { name: 'Эби тэмпура ж', orders: '242 шт.', link: '/manage/dash/products/1-7-2025/1-8-2025/51' },
      ],
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6  ">
      

        {/* Main Content */}
        <main className=" w-full space-y-6">
          <Header {...headerProps} />
          <TodayStats {...todayStatsData} />
          <MainChart {...mainChartData} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <HourlyStats {...hourlyStatsData} />
            </div>
            <div>
              <WeekdayStats {...weekdayStatsData} />
            </div>
          </div>
          <StatsWidgets />
          <PopularProducts {...popularProductsData} />
        </main>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}