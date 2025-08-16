/**
 * Общие типы для всего приложения
 */

// Базовые типы
export type ID = string | number;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseDto {
  id?: ID;
}

// Статусы
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

export interface StatusInfo {
  status: Status;
  label: string;
  color: string;
  icon?: string;
}

// Пагинация
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Фильтры
export interface BaseFilter {
  search?: string;
  status?: Status;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface DateRange {
  from: Date;
  to: Date;
}

// API ответы
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Формы
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => string | null;
  };
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Уведомления
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Модальные окна
export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

// Навигация
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  permissions?: string[];
}

// Настройки пользователя
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  display: {
    compactMode: boolean;
    showImages: boolean;
    itemsPerPage: number;
  };
}

// Экспорт/импорт
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeHeaders?: boolean;
  dateFormat?: string;
  timezone?: string;
}

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  totalRows: number;
  importedRows: number;
}

// Утилиты для типов
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PickRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;
