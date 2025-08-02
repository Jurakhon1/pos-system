'use client';

import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/datepicker';
import { Menu } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface HeaderProps {
  title: string;
  dateStart: string;
  dateEnd: string;
  timeStart: number;
  timeEnd: number;
  timezoneShift: number;
  onExport: () => void;
  onPrint: () => void;
  onMenuToggle: () => void;
}

export function Header({
  title,
  dateStart,
  dateEnd,
  timeStart,
  timeEnd,
  timezoneShift,
  onExport,
  onPrint,
  onMenuToggle,
}: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white  md:p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex gap-2">
          <Button
            onClick={onExport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Экспорт
          </Button>
          <Button
            onClick={onPrint}
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Печать
          </Button>
        </div>
        <DatePicker
          dateStart={dateStart}
          dateEnd={dateEnd}
          timeStart={timeStart}
          timeEnd={timeEnd}
          timezoneShift={timezoneShift}
        />
      </div>
    </header>
  );
}