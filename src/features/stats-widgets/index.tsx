'use client';

import { Button } from '@/shared/ui/button';
import { formatNumber } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';

interface WidgetItem {
  label: string;
  percentage: number;
  value: number;
}

interface StatsWidgetProps {
  title: string;
  items: WidgetItem[];
}

export function StatsWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatsWidget
        title="Методы оплаты"
        items={[
          { label: 'Наличные', percentage: 57.76, value: 287849.79 },
          { label: 'Душанбе Сити', percentage: 23.01, value: 114694.61 },
          { label: 'Алиф', percentage: 18.7, value: 93223.27 },
        ]}
      />
      <StatsWidget
        title="Источники заказов"
        items={[
          { label: 'В заведении', percentage: 45.15, value: 225035.41 },
          { label: 'Доставка', percentage: 38.83, value: 193529.37 },
          { label: 'Навынос', percentage: 16.02, value: 79832.91 },
        ]}
      />
    </div>
  );
}

function StatsWidget({ title, items }: StatsWidgetProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h4 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-100"
          >
            Оборот
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-100"
          >
            Чеки
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px]">
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 pr-2 text-sm text-gray-700">{item.label}</td>
                <td className="py-3 w-1/2">
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    <div
                      className="absolute h-2 bg-blue-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
                      {item.percentage}%
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right text-sm text-gray-700">{formatNumber(item.value)} с</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-800"
        >
          Показать все
        </Button>
      </div>
    </div>
  );
}