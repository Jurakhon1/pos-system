import { FC } from 'react';
import { useEmployeeStore } from '../model/employeeStore';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export const EmployeeTabs: FC = () => {
  const { activeTab, setActiveTab } = useEmployeeStore();

  return (
    <div className="flex space-x-2">
      <Link href="/manage/dash/waiters">
        <Button
          variant={activeTab === 'waiters' ? 'default' : 'outline'}
          onClick={() => setActiveTab('waiters')}
        >
          Официанты
        </Button>
      </Link>
      <Link href="">
        <Button
          variant={activeTab === 'couriers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('couriers')}
        >
          Курьеры
        </Button>
      </Link>
    </div>
  );
};