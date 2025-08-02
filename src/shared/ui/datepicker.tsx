'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface DatePickerProps {
  dateStart: string;
  dateEnd: string;
  timeStart: number;
  timeEnd: number;
  timezoneShift: number;
}

export function DatePicker({ dateStart, dateEnd }: DatePickerProps) {
  const [range, setRange] = useState<DateRange>({
    from: new Date(dateStart),
    to: new Date(dateEnd),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto justify-start text-left font-normal border-gray-300 hover:bg-gray-100"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span className="hidden sm:inline">
            {range.from && format(range.from, 'd MMMM', { locale: ru })} —{' '}
            {range.to && format(range.to, 'd MMMM', { locale: ru })}
          </span>
          <span className="sm:hidden">
            {range.from && format(range.from, 'd MMM', { locale: ru })} —{' '}
            {range.to && format(range.to, 'd MMM', { locale: ru })}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={(newRange) => {
            if (newRange && newRange.from && newRange.to) {
              setRange({ from: newRange.from, to: newRange.to });
            }
          }}
          locale={ru}
          numberOfMonths={2}
          className="bg-white"
        />
        <div className="p-3 border-t border-gray-200">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Применить
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}