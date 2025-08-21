import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrdersPage from '../src/app/orders/page';

// Мокаем модули
vi.mock('@/entities/orders/hooks/useOrders', () => ({
  useOrders: () => ({
    orders: [
      {
        id: '1',
        order_number: 'ORD-001',
        status: 'ready',
        total_amount: 1500.00,
        customer_name: 'Иван Иванов',
        customer_phone: '+7-999-123-45-67',
        order_type: 'dine_in',
        created_at: new Date().toISOString(),
        orderItems: [
          {
            id: 'item-1',
            quantity: 2,
            unit_price: 750.00,
            menuItem: {
              id: 'menu-1',
              name: 'Суши Калифорния',
              price: 750.00
            }
          }
        ]
      }
    ],
    isLoading: false,
    error: null,
    processPayment: vi.fn(),
    cancelOrder: vi.fn(),
    updateOrderStatus: vi.fn(),
    deleteOrder: vi.fn(),
    isProcessingPayment: false,
    isCancelling: false,
    isUpdatingStatus: false,
    isDeleting: false
  })
}));

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/orders',
}));

// Мокаем lucide-react иконки
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">🔍</div>,
  Filter: () => <div data-testid="filter-icon">🔧</div>,
  Clock: () => <div data-testid="clock-icon">⏰</div>,
  User: () => <div data-testid="user-icon">👤</div>,
  ShoppingCart: () => <div data-testid="cart-icon">🛒</div>,
  Eye: () => <div data-testid="eye-icon">👁️</div>,
  Edit: () => <div data-testid="edit-icon">✏️</div>,
  Trash2: () => <div data-testid="trash-icon">🗑️</div>,
  Plus: () => <div data-testid="plus-icon">➕</div>,
  Table: () => <div data-testid="table-icon">🪑</div>,
  Phone: () => <div data-testid="phone-icon">📞</div>,
  Users: () => <div data-testid="users-icon">👥</div>,
  AlertTriangle: () => <div data-testid="alert-icon">⚠️</div>,
  CheckCircle: () => <div data-testid="check-icon">✅</div>,
  XCircle: () => <div data-testid="x-icon">❌</div>,
  Loader2: () => <div data-testid="loader-icon">🔄</div>,
  CreditCard: () => <div data-testid="credit-card-icon">💳</div>,
  DollarSign: () => <div data-testid="dollar-icon">💰</div>,
}));

describe('OrdersPage - Notifications System', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should show success notification when payment is processed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Заполняем форму платежа
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что уведомление об успехе отображается
    await waitFor(() => {
      expect(screen.getByText('Платеж обработан')).toBeInTheDocument();
      expect(screen.getByText('Заказ #ORD-001 успешно оплачен')).toBeInTheDocument();
    });
  });

  it('should show info notification when order status is changed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    // Находим селектор статуса и изменяем его
    const statusSelect = screen.getByDisplayValue('ready');
    fireEvent.change(statusSelect, { target: { value: 'paid' } });

    // Проверяем, что уведомление об изменении статуса отображается
    await waitFor(() => {
      expect(screen.getByText('Статус изменен')).toBeInTheDocument();
      expect(screen.getByText('Статус заказа изменен на "Оплачен"')).toBeInTheDocument();
    });
  });

  it('should display notification with correct styling for success type', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    await waitFor(() => {
      const notification = screen.getByText('Платеж обработан').closest('div');
      expect(notification).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
    });
  });

  it('should display notification with correct styling for info type', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const statusSelect = screen.getByDisplayValue('ready');
    fireEvent.change(statusSelect, { target: { value: 'paid' } });

    await waitFor(() => {
      const notification = screen.getByText('Статус изменен').closest('div');
      expect(notification).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
    });
  });

  it('should show multiple notifications when multiple actions are performed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    // Изменяем статус
    const statusSelect = screen.getByDisplayValue('ready');
    fireEvent.change(statusSelect, { target: { value: 'paid' } });

    // Обрабатываем платеж
    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что оба уведомления отображаются
    await waitFor(() => {
      expect(screen.getByText('Статус изменен')).toBeInTheDocument();
      expect(screen.getByText('Платеж обработан')).toBeInTheDocument();
    });
  });

  it('should close notification when close button is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    await waitFor(() => {
      const notification = screen.getByText('Платеж обработан').closest('div');
      const closeButton = notification?.querySelector('button');
      
      if (closeButton) {
        fireEvent.click(closeButton);
      }
    });

    // Проверяем, что уведомление исчезло
    await waitFor(() => {
      expect(screen.queryByText('Платеж обработан')).not.toBeInTheDocument();
    });
  });

  it('should automatically hide notifications after specified duration', async () => {
    vi.useFakeTimers();

    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Платеж обработан')).toBeInTheDocument();
    });

    // Перематываем время на 5 секунд (больше чем duration уведомления)
    vi.advanceTimersByTime(5000);

    // Проверяем, что уведомление автоматически исчезло
    await waitFor(() => {
      expect(screen.queryByText('Платеж обработан')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('should display notification with correct icon for success type', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    await waitFor(() => {
      const notification = screen.getByText('Платеж обработан').closest('div');
      const icon = notification?.querySelector('[data-testid="check-icon"]');
      expect(icon).toBeInTheDocument();
    });
  });

  it('should display notification with correct icon for info type', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const statusSelect = screen.getByDisplayValue('ready');
    fireEvent.change(statusSelect, { target: { value: 'paid' } });

    await waitFor(() => {
      const notification = screen.getByText('Статус изменен').closest('div');
      const icon = notification?.querySelector('[data-testid="info-icon"]');
      expect(icon).toBeInTheDocument();
    });
  });
});
