import { FC } from 'react';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export const EmployeeToolbar: FC = () => {
  const columns = [
    'Официант',
    'Выручка',
    'Прибыль',
    'Чеки',
    'Средний чек',
    'Среднее время',
    'Процент за обслуживание',
  ];

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Icon name="Columns" className="h-4 w-4 mr-2" />
            Столбцы
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem key={column} checked>
              {column}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline">
        <Icon name="Download" className="h-4 w-4 mr-2" />
        Экспорт
      </Button>
      <Button variant="outline">
        <Icon name="Printer" className="h-4 w-4 mr-2" />
        Печать
      </Button>
    </div>
  );
};