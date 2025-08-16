export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: "admin" | "cashier" | "manager" | "chef" | "waiter";
}

export interface RegisterUser {
  username: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}
