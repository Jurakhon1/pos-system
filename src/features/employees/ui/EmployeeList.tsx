import { FC } from 'react';
import { Employee } from '@/entities/employee/types';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { useEmployeeStore } from '../model/employeeStore';

interface EmployeeListProps {
  employees: Employee[];
  onDelete: (id: string) => void;
}

export const EmployeeList: FC<EmployeeListProps> = ({ employees, onDelete }) => {
  const { dateRange } = useEmployeeStore(); // Получаем диапазон дат из хранилища

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Официант</th>
            <th className="p-2 text-right">Выручка</th>
            <th className="p-2 text-right">Прибыль</th>
            <th className="p-2 text-right">Чеки</th>
            <th className="p-2 text-right">Средний чек</th>
            <th className="p-2 text-right">Среднее время</th>
            <th className="p-2 text-right">Процент за обслуживание</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b">
              <td className="p-2">
                <Link href={`/manage/dash/waiters/${dateRange.start}/${dateRange.end}/${employee.id}`}>
                  {employee.name}
                </Link>
              </td>
              <td className="p-2 text-right">{employee.revenue.toLocaleString()} с</td>
              <td className="p-2 text-right">{employee.profit.toLocaleString()} с</td>
              <td className="p-2 text-right">{employee.receiptsCount} шт.</td>
              <td className="p-2 text-right">{employee.averageReceipt.toLocaleString()} с</td>
              <td className="p-2 text-right">{employee.averageTime}</td>
              <td className="p-2 text-right">{employee.serviceCharge.toLocaleString()} с</td>
              <td className="p-2">
                <Button variant="destructive" onClick={() => onDelete(employee.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};