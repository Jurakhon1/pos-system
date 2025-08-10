"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, isPositive, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {change}
            </span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

export function SalesStats() {
  const stats = [
    {
      title: "Выручка",
      value: "₽ 125,430",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Заказы",
      value: "1,247",
      change: "+8.2%",
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: "Клиенты",
      value: "892",
      change: "+15.3%",
      isPositive: true,
      icon: Users,
    },
    {
      title: "Средний чек",
      value: "₽ 1,247",
      change: "-2.1%",
      isPositive: false,
      icon: Clock,
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}