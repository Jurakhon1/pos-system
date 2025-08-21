"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Bell,
  Shield,
  Globe,
  Palette,
  Printer,
  CreditCard
} from "lucide-react";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { USER_ROLES } from "@/shared/types/auth";

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    restaurantName: "SmartChef Restaurant",
    address: "ул. Примерная, 123",
    phone: "+7 (999) 123-45-67",
    email: "info@smartchef.ru",
    timezone: "Europe/Moscow",
    language: "ru"
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    notifications: true,
    darkMode: true,
    autoLogout: false,
    sessionTimeout: 30
  });

  const [posSettings, setPosSettings] = useState({
    defaultCurrency: "RUB",
    taxRate: 20,
    serviceCharge: 10,
    receiptHeader: "SmartChef Restaurant",
    receiptFooter: "Спасибо за посещение!"
  });

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    console.log('Сохранение настроек...');
  };

  const handleReset = () => {
    // Здесь будет логика сброса настроек
    console.log('Сброс настроек...');
  };

  return (
    <RoleGuard requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Настройки системы</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Конфигурация параметров системы
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Сброс
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>

        {/* Общие настройки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Общие настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restaurantName">Название ресторана</Label>
                <Input
                  id="restaurantName"
                  value={generalSettings.restaurantName}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, restaurantName: e.target.value }))}
                  placeholder="Введите название ресторана"
                />
              </div>
              <div>
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Введите адрес"
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={generalSettings.phone}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Введите телефон"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={generalSettings.email}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Введите email"
                />
              </div>
              <div>
                <Label htmlFor="timezone">Часовой пояс</Label>
                <select
                  id="timezone"
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Europe/Moscow">Москва (UTC+3)</option>
                  <option value="Europe/London">Лондон (UTC+0)</option>
                  <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">Язык</Label>
                <select
                  id="language"
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Системные настройки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              Системные настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Автоматическое резервное копирование</Label>
                  <p className="text-sm text-gray-500">Создавать резервные копии автоматически</p>
                </div>
                <Switch
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Уведомления</Label>
                  <p className="text-sm text-gray-500">Показывать системные уведомления</p>
                </div>
                <Switch
                  checked={systemSettings.notifications}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, notifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Темная тема</Label>
                  <p className="text-sm text-gray-500">Использовать темную тему по умолчанию</p>
                </div>
                <Switch
                  checked={systemSettings.darkMode}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, darkMode: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Автоматический выход</Label>
                  <p className="text-sm text-gray-500">Автоматически выходить из системы</p>
                </div>
                <Switch
                  checked={systemSettings.autoLogout}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoLogout: checked }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Таймаут сессии (минуты)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={systemSettings.sessionTimeout}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                min="5"
                max="120"
              />
            </div>
          </CardContent>
        </Card>

        {/* Настройки POS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Настройки POS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultCurrency">Валюта по умолчанию</Label>
                <select
                  id="defaultCurrency"
                  value={posSettings.defaultCurrency}
                  onChange={(e) => setPosSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="RUB">Рубль (₽)</option>
                  <option value="USD">Доллар ($)</option>
                  <option value="EUR">Евро (€)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="taxRate">Налоговая ставка (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={posSettings.taxRate}
                  onChange={(e) => setPosSettings(prev => ({ ...prev, taxRate: parseInt(e.target.value) }))}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="serviceCharge">Сервисный сбор (%)</Label>
                <Input
                  id="serviceCharge"
                  type="number"
                  value={posSettings.serviceCharge}
                  onChange={(e) => setPosSettings(prev => ({ ...prev, serviceCharge: parseInt(e.target.value) }))}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="receiptHeader">Заголовок чека</Label>
              <Input
                id="receiptHeader"
                value={posSettings.receiptHeader}
                onChange={(e) => setPosSettings(prev => ({ ...prev, receiptHeader: e.target.value }))}
                placeholder="Заголовок для печати на чеке"
              />
            </div>
            <div>
              <Label htmlFor="receiptFooter">Подпись чека</Label>
              <Input
                id="receiptFooter"
                value={posSettings.receiptFooter}
                onChange={(e) => setPosSettings(prev => ({ ...prev, receiptFooter: e.target.value }))}
                placeholder="Подпись для печати на чеке"
              />
            </div>
          </CardContent>
        </Card>

        {/* Дополнительные настройки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-red-600" />
                База данных
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Создать резервную копию
              </Button>
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Восстановить из копии
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Оптимизировать БД
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Безопасность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Изменить пароль
              </Button>
              <Button variant="outline" className="w-full">
                <Bell className="w-4 h-4 mr-2" />
                Настройки уведомлений
              </Button>
              <Button variant="outline" className="w-full">
                <Palette className="w-4 h-4 mr-2" />
                Настройки темы
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
