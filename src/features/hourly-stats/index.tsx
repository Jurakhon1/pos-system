'use client';

import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface HourlyStatsProps {
  data: number[];
  labels: string[];
}

export function HourlyStats({ data, labels }: HourlyStatsProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Выручка',
        data,
        backgroundColor: '#2563eb',
        borderColor: '#1e3a8a',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">По времени</h4>
      <div className="h-48">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937' } },
            scales: { x: { grid: { display: false } }, y: { grid: { color: '#e5e7eb' } } },
          }}
        />
      </div>
    </div>
  );
}