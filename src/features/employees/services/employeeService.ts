"use client";
import { useState, useEffect } from "react";
import { Employee } from "@/entities/employee/types";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: "1",
        name: "Shef",
        revenue: 0,
        profit: 0,
        receiptsCount: 0,
        averageReceipt: 0,
        averageTime: "0 секунд",
        serviceCharge: 0,
      },
      {
        id: "2",
        name: "Sushi Chef",
        revenue: 504087.59,
        profit: 333481.66,
        receiptsCount: 2423,
        averageReceipt: 210.83,
        averageTime: "50 минут 29 секунд",
        serviceCharge: 19475,
      },
      {
        id: "3",
        name: "Замира",
        revenue: 0,
        profit: 0,
        receiptsCount: 0,
        averageReceipt: 0,
        averageTime: "0 секунд",
        serviceCharge: 0,
      },
      {
        id: "4",
        name: "Ситора",
        revenue: 0,
        profit: 0,
        receiptsCount: 0,
        averageReceipt: 0,
        averageTime: "0 секунд",
        serviceCharge: 0,
      },
    ];
    setEmployees(mockEmployees);
  }, []);

  const deleteEmployee = async (id: string) => {
    try {
      await fetch(`/api/employees/${id}`, { method: "DELETE" });
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return { employees, deleteEmployee };
};
