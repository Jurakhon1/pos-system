import { formatNumber } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';

interface StatItem {
  label: string;
  value: number;
  percentage: number;
  unit?: string;
}

interface TodayStatsProps {
  date: string;
  stats: StatItem[];
}

export function TodayStats({ date, stats }: TodayStatsProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Сегодня, <span className="sm:inline hidden"><br /></span>
        {date}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-lg font-bold text-gray-900">
              {formatNumber(stat.value)} {stat.unit || ''}{' '}
              <span className="text-green-600 text-sm">
                <sup>+{stat.percentage}%</sup>
              </span>
            </h4>
            <p className="text-sm text-gray-600 capitalize">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}