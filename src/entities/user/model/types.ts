export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 
  | 'admin'        // Администратор
  | 'manager'      // Менеджер
  | 'cashier'      // Кассир
  | 'kitchen'      // Кухня
  | 'delivery';    // Доставка

export interface CreateUserDto {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  cashier: 'Кассир',
  kitchen: 'Кухня',
  delivery: 'Доставка',
};

export const USER_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'orders', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['read'] },
  ],
  manager: [
    { resource: 'products', actions: ['create', 'read', 'update'] },
    { resource: 'categories', actions: ['create', 'read', 'update'] },
    { resource: 'orders', actions: ['read', 'update'] },
    { resource: 'reports', actions: ['read'] },
  ],
  cashier: [
    { resource: 'products', actions: ['read'] },
    { resource: 'orders', actions: ['create', 'read'] },
  ],
  kitchen: [
    { resource: 'orders', actions: ['read', 'update'] },
  ],
  delivery: [
    { resource: 'orders', actions: ['read', 'update'] },
  ],
};
