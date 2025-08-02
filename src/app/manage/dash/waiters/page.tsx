"use client"
import { FC } from 'react';
import { EmployeeList } from '@/features/employees/ui/EmployeeList';
import { EmployeeFilters } from '@/features/employees/ui/EmployeeFilters';
import { EmployeeTabs } from '@/features/employees/ui/EmployeeTabs';
import { EmployeeToolbar } from '@/features/employees/ui/EmployeeToolbar';
import { useEmployees } from '@/features/employees/services/employeeService';
import { useEmployeeStore } from '@/features/employees/model/employeeStore';

export const EmployeesPage: FC = () => {
  const { employees, deleteEmployee } = useEmployees();
  const { searchQuery, activeTab } = useEmployeeStore();

  // Фильтрация сотрудников по поиску и вкладке
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeTab === 'waiters' ? employee.name !== 'Courier' : employee.name === 'Courier')
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Сотрудники <span className="text-gray-500">({employees.length})</span>
        </h1>
        <EmployeeToolbar />
      </div>
      <EmployeeTabs />
      <EmployeeFilters />
      <EmployeeList employees={filteredEmployees} onDelete={deleteEmployee} />
    </div>
  );
};

export default EmployeesPage;