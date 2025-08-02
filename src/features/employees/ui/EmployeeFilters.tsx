import { FC } from 'react';
import { useEmployeeStore } from '../model/employeeStore';
import { Input } from '@/shared/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';

export const EmployeeFilters: FC = () => {
  const { searchQuery, setSearchQuery } = useEmployeeStore();

  const sources = ['В заведении', 'Навынос', 'Доставка'];
  const waiters = ['Sushi Chef', 'Shef', 'Замира', 'Ситора'];

  return (
    <div className="flex gap-4 items-center">
      <Input
        type="search"
        placeholder="Быстрый поиск"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Официант <span className="ml-2">▼</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {waiters.map((waiter) => (
            <DropdownMenuItem key={waiter}>{waiter}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Источник <span className="ml-2">▼</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {sources.map((source) => (
            <DropdownMenuItem key={source}>{source}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};