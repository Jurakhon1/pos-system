export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: "superadmin" | "admin" | "cashier" | "manager" | "chef" | "cook" | "waiter";
  first_name?: string;
  last_name?: string;
}

export interface RegisterUser {
  username: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: User;
}

// Константы ролей
export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  CASHIER: 'cashier',
  MANAGER: 'manager',
  CHEF: 'chef',
  COOK: 'cook',
  WAITER: 'waiter'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Маппинг ролей на доступные страницы
export const ROLE_ACCESS = {
  [USER_ROLES.SUPERADMIN]: ['/dashboard', '/admin', '/reports', '/settings', '/kitchen', '/pos', '/orders'],
  [USER_ROLES.ADMIN]: ['/dashboard', '/admin', '/reports', '/settings', '/kitchen', '/pos', '/orders'],
  [USER_ROLES.CASHIER]: ['/pos', '/orders'],
  [USER_ROLES.MANAGER]: ['/dashboard', '/reports', '/settings', '/kitchen', '/pos', '/orders'],
  [USER_ROLES.CHEF]: ['/kitchen'],
  [USER_ROLES.COOK]: ['/kitchen'],
  [USER_ROLES.WAITER]: ['/pos', '/orders']
} as const;

// Дефолтная страница для каждой роли
export const ROLE_DEFAULT_PAGE = {
  [USER_ROLES.SUPERADMIN]: '/dashboard',
  [USER_ROLES.ADMIN]: '/dashboard',
  [USER_ROLES.CASHIER]: '/pos',
  [USER_ROLES.MANAGER]: '/dashboard',
  [USER_ROLES.CHEF]: '/kitchen',
  [USER_ROLES.COOK]: '/kitchen',
  [USER_ROLES.WAITER]: '/pos'
} as const;
