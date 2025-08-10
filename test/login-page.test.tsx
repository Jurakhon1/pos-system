import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { LoginForm } from '@/components/ui/login-form';

// Mock useAuth hook
jest.mock('@/shared/hooks/use-auth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('LoginPage', () => {
  it('renders login page with all elements', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Вход в систему')).toBeInTheDocument();
    expect(screen.getByText('POS система управления рестораном')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Пароль')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Запомнить меня')).toBeInTheDocument();
    expect(screen.getByText('Забыли пароль?')).toBeInTheDocument();
  });

  it('renders login form with proper styling', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Введите ваш email');
    const passwordInput = screen.getByPlaceholderText('Введите ваш пароль');
    const submitButton = screen.getByText('Войти');
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('bg-blue-600');
  });
});

describe('LoginForm', () => {
  it('handles form submission', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText('Введите ваш email');
    const passwordInput = screen.getByPlaceholderText('Введите ваш пароль');
    const submitButton = screen.getByText('Войти');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows error message for invalid credentials', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText('Введите ваш email');
    const passwordInput = screen.getByPlaceholderText('Введите ваш пароль');
    const submitButton = screen.getByText('Войти');
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    // Error message should appear
    expect(screen.getByText('Неверный email или пароль')).toBeInTheDocument();
  });
});
