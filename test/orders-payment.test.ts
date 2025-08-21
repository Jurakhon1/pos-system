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

describe('OrdersPage - Payment and Cancellation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should render payment button for non-paid orders', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    // Проверяем, что кнопка оплаты отображается для заказа со статусом 'ready'
    const paymentButton = screen.getByText('Оплатить');
    expect(paymentButton).toBeInTheDocument();
  });

  it('should render cancel button for non-cancelled orders', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    // Проверяем, что кнопка отмены отображается для заказа со статусом 'ready'
    const cancelButton = screen.getByText('Отменить');
    expect(cancelButton).toBeInTheDocument();
  });

  it('should open payment modal when payment button is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    // Проверяем, что модальное окно оплаты открылось
    await waitFor(() => {
      expect(screen.getByText('Обработка платежа')).toBeInTheDocument();
    });
  });

  it('should show order details in payment modal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      expect(screen.getByText('Заказ #ORD-001')).toBeInTheDocument();
      expect(screen.getByText('Сумма: ₽1500.00')).toBeInTheDocument();
    });
  });

  it('should display payment method options', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      expect(screen.getByText('Наличные')).toBeInTheDocument();
      expect(screen.getByText('Карта')).toBeInTheDocument();
      expect(screen.getByText('Смешанная оплата')).toBeInTheDocument();
    });
  });

  it('should allow discount input', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      const discountInput = screen.getByPlaceholderText('0.00');
      expect(discountInput).toBeInTheDocument();
      
      fireEvent.change(discountInput, { target: { value: '100' } });
      expect(discountInput).toHaveValue('100');
    });
  });

  it('should calculate final total with discount', async () => {
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
      
      // Проверяем, что итоговая сумма уменьшилась на размер скидки
      expect(screen.getByText('Итого к оплате: ₽1400.00')).toBeInTheDocument();
    });
  });

  it('should show cash amount input for cash payment method', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // По умолчанию выбран способ оплаты наличными
      const cashAmountInput = screen.getByPlaceholderText('1400.00');
      expect(cashAmountInput).toBeInTheDocument();
    });
  });

  it('should show card amount input for card payment method', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Выбираем способ оплаты картой
      const cardRadio = screen.getByDisplayValue('card');
      fireEvent.click(cardRadio);
      
      const cardAmountInput = screen.getByPlaceholderText('1400.00');
      expect(cardAmountInput).toBeInTheDocument();
    });
  });

  it('should show both inputs for mixed payment method', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Выбираем смешанный способ оплаты
      const mixedRadio = screen.getByDisplayValue('mixed');
      fireEvent.click(mixedRadio);
      
      const cashAmountInput = screen.getByPlaceholderText('0.00');
      const cardAmountInput = screen.getByPlaceholderText('0.00');
      
      expect(cashAmountInput).toBeInTheDocument();
      expect(cardAmountInput).toBeInTheDocument();
    });
  });

  it('should validate mixed payment amounts', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Выбираем смешанный способ оплаты
      const mixedRadio = screen.getByDisplayValue('mixed');
      fireEvent.click(mixedRadio);
      
      // Устанавливаем скидку
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100' } });
      
      // Устанавливаем суммы меньше итоговой
      const cashAmountInput = screen.getByPlaceholderText('0.00');
      const cardAmountInput = screen.getByPlaceholderText('0.00');
      
      fireEvent.change(cashAmountInput, { target: { value: '500' } });
      fireEvent.change(cardAmountInput, { target: { value: '500' } });
      
      // Проверяем, что кнопка оплаты заблокирована (500 + 500 < 1400)
      const payButton = screen.getByText('Оплатить');
      expect(payButton).toBeDisabled();
    });
  });

  it('should close payment modal when cancel button is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      const cancelButton = screen.getByText('Отмена');
      fireEvent.click(cancelButton);
      
      // Проверяем, что модальное окно закрылось
      expect(screen.queryByText('Обработка платежа')).not.toBeInTheDocument();
    });
  });
});
