'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatNumber } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface MainChartProps {
  data: number[];
  labels: string[];
}

export function MainChart({ data, labels }: MainChartProps) {
  const [interval, setInterval] = useState<'day' | 'week' | 'month'>('day');

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Выручка',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h4 className="text-lg md:text-xl font-semibold text-gray-800">Выручка</h4>
        <div className="flex gap-2">
          <Button
            variant={interval === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInterval('day')}
            className={cn(
              interval === 'day' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:bg-gray-100'
            )}
          >
            День
          </Button>
          <Button
            variant={interval === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInterval('week')}
            className={cn(
              interval === 'week' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:bg-gray-100'
            )}
          >
            Неделя
          </Button>
          <Button
            variant={interval === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInterval('month')}
            className={cn(
              interval === 'month' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:bg-gray-100'
            )}
          >
            Месяц
          </Button>
        </div>
      </div>
      <div className="h-64">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { backgroundColor: '#1f2937', titleFont: { size: 14 }, bodyFont: { size: 12 } },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: '#e5e7eb' } },
            },
          }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
        {['revenue', 'profit', 'transactions', 'visitors', 'average_receipt'].map((type, index) => (
          <div key={type} className="text-center">
            <h4 className="text-lg font-bold text-gray-900">{formatNumber(data[index] || 0)} с</h4>
            <p className="text-sm text-gray-600 capitalize">
              {type === 'revenue' ? 'выручка' : type === 'profit' ? 'прибыль' : type === 'transactions' ? 'чеков' : type === 'visitors' ? 'посетителей' : 'средний чек'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}