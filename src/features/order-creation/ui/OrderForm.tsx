"use client";

import { useState } from "react";
import { User, Phone, Users, FileText, CreditCard } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  guestCount: number;
  notes: string;
  orderType: 'dine_in' | 'takeaway';
}

interface OrderFormProps {
  selectedTable: string | null;
  onSubmit: (formData: OrderFormData) => void;
  isSubmitting: boolean;
}

export const OrderForm = ({
  selectedTable,
  onSubmit,
  isSubmitting
}: OrderFormProps) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    guestCount: 1,
    notes: '',
    orderType: 'dine_in'
  });

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Данные заказа
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Тип заказа */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={formData.orderType === 'dine_in' ? 'default' : 'outline'}
            onClick={() => handleInputChange('orderType', 'dine_in')}
            className="flex-1"
          >
            В ресторане
          </Button>
          <Button
            type="button"
            variant={formData.orderType === 'takeaway' ? 'default' : 'outline'}
            onClick={() => handleInputChange('orderType', 'takeaway')}
            className="flex-1"
          >
            На вынос
          </Button>
        </div>

        {/* Выбор стола (только для заказов в ресторане) */}
        {formData.orderType === 'dine_in' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Номер стола
            </label>
            <div className="text-sm text-gray-500">
              {selectedTable ? `Выбран стол: ${selectedTable}` : 'Стол не выбран'}
            </div>
            {!selectedTable && (
              <div className="text-sm text-red-500">
                Для заказа в ресторане необходимо выбрать стол
              </div>
            )}
          </div>
        )}

        {/* Имя клиента */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            Имя клиента
          </label>
          <Input
            type="text"
            placeholder="Введите имя клиента"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            required
          />
        </div>

        {/* Телефон клиента */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Телефон клиента
          </label>
          <Input
            type="tel"
            placeholder="+7 (900) 123-45-67"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            required
          />
        </div>

        {/* Количество гостей */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Количество гостей
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
              <Button
                key={count}
                type="button"
                variant={formData.guestCount === count ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleInputChange('guestCount', count)}
                className="w-10 h-10"
              >
                {count}
              </Button>
            ))}
          </div>
        </div>

        {/* Заметки */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Заметки к заказу
          </label>
          <Input
            type="text"
            placeholder="Например: Без лука, острое"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>

        {/* Кнопка отправки */}
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={isSubmitting || !formData.customerName || !formData.customerPhone || (formData.orderType === 'dine_in' && !selectedTable)}
        >
          {isSubmitting ? 'Создание заказа...' : 'Создать заказ'}
        </Button>
      </form>
    </Card>
  );
};
