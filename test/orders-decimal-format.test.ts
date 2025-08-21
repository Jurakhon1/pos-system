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

describe('OrdersPage - Decimal Format Validation', () => {
  let queryClient: QueryClient;
  let mockProcessPayment: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    
    // Создаем мок для processPayment
    mockProcessPayment = vi.fn();
    vi.mocked(require('@/entities/orders/hooks/useOrders').useOrders).mockReturnValue({
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
      processPayment: mockProcessPayment,
      cancelOrder: vi.fn(),
      updateOrderStatus: vi.fn(),
      deleteOrder: vi.fn(),
      isProcessingPayment: false,
      isCancelling: false,
      isUpdatingStatus: false,
      isDeleting: false
    });
  });

  it('should format cash payment with decimal numbers', async () => {
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

    // Проверяем, что processPayment был вызван с корректно отформатированными числами
    expect(mockProcessPayment).toHaveBeenCalledWith({
      orderId: '1',
      paymentData: {
        paymentMethod: 'cash',
        cashAmount: 1400.00,  // 1500 - 100 = 1400.00 (decimal)
        discountAmount: 100.00 // 100.00 (decimal)
      }
    });
  });

  it('should format card payment with decimal numbers', async () => {
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
      
      // Устанавливаем скидку
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '50' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что processPayment был вызван с корректно отформатированными числами
    expect(mockProcessPayment).toHaveBeenCalledWith({
      orderId: '1',
      paymentData: {
        paymentMethod: 'card',
        cardAmount: 1450.00,  // 1500 - 50 = 1450.00 (decimal)
        discountAmount: 50.00  // 50.00 (decimal)
      }
    });
  });

  it('should format mixed payment with decimal numbers', async () => {
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
      
      // Устанавливаем суммы
      const cashAmountInput = screen.getByPlaceholderText('0.00');
      const cardAmountInput = screen.getByPlaceholderText('0.00');
      
      fireEvent.change(cashAmountInput, { target: { value: '500' } });
      fireEvent.change(cardAmountInput, { target: { value: '900' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что processPayment был вызван с корректно отформатированными числами
    expect(mockProcessPayment).toHaveBeenCalledWith({
      orderId: '1',
      paymentData: {
        paymentMethod: 'mixed',
        cashAmount: 500.00,   // 500.00 (decimal)
        cardAmount: 900.00,   // 900.00 (decimal)
        discountAmount: 100.00 // 100.00 (decimal)
      }
    });
  });

  it('should always send discountAmount even when zero', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Не устанавливаем скидку (оставляем 0)
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что discountAmount всегда отправляется, даже если 0
    expect(mockProcessPayment).toHaveBeenCalledWith({
      orderId: '1',
      paymentData: {
        paymentMethod: 'cash',
        cashAmount: 1500.00,  // 1500.00 (decimal)
        discountAmount: 0.00   // 0.00 (decimal) - всегда отправляется
      }
    });
  });

  it('should handle fractional amounts correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Устанавливаем дробную скидку
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '99.99' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что дробные числа корректно обрабатываются
    expect(mockProcessPayment).toHaveBeenCalledWith({
      orderId: '1',
      paymentData: {
        paymentMethod: 'cash',
        cashAmount: 1400.01,  // 1500 - 99.99 = 1400.01 (decimal)
        discountAmount: 99.99  // 99.99 (decimal)
      }
    });
  });

  it('should round numbers to 2 decimal places', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Устанавливаем скидку с большим количеством знаков после запятой
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '100.567' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что числа округляются до 2 знаков после запятой
    expect(mockProcessPayment).toHaveBeenCalledWith({
      orderId: '1',
      paymentData: {
        paymentMethod: 'cash',
        cashAmount: 1399.43,  // 1500 - 100.57 = 1399.43 (округлено)
        discountAmount: 100.57 // 100.567 округлено до 100.57
      }
    });
  });

  it('should handle edge case with zero discount', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>
    );

    const paymentButton = screen.getByText('Оплатить');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      // Явно устанавливаем скидку 0
      const discountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(discountInput, { target: { value: '0' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что 0 корректно форматируется как 0.00
    expect(mockProcessPayment).toHaveBeenCalledWith({
      orderId: '1',
      paymentData: {
        paymentMethod: 'cash',
        cashAmount: 1500.00,  // 1500.00 (decimal)
        discountAmount: 0.00   // 0.00 (decimal)
      }
    });
  });

  it('should validate that all numeric fields are properly formatted', async () => {
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
      
      // Устанавливаем различные значения
      const discountInput = screen.getByPlaceholderText('0.00');
      const cashAmountInput = screen.getByPlaceholderText('0.00');
      const cardAmountInput = screen.getByPlaceholderText('0.00');
      
      fireEvent.change(discountInput, { target: { value: '25.50' } });
      fireEvent.change(cashAmountInput, { target: { value: '750' } });
      fireEvent.change(cardAmountInput, { target: { value: '724.50' } });
      
      const payButton = screen.getByText('Оплатить');
      fireEvent.click(payButton);
    });

    // Проверяем, что все числовые поля корректно отформатированы
    const callArgs = mockProcessPayment.mock.calls[0][0];
    const paymentData = callArgs.paymentData;
    
    // Проверяем, что все числа имеют тип number и корректно отформатированы
    expect(typeof paymentData.cashAmount).toBe('number');
    expect(typeof paymentData.cardAmount).toBe('number');
    expect(typeof paymentData.discountAmount).toBe('number');
    
    // Проверяем, что числа имеют максимум 2 знака после запятой
    expect(paymentData.cashAmount).toBe(750.00);
    expect(paymentData.cardAmount).toBe(724.50);
    expect(paymentData.discountAmount).toBe(25.50);
    
    // Проверяем, что сумма cash + card + discount = total
    expect(paymentData.cashAmount + paymentData.cardAmount + paymentData.discountAmount).toBe(1500.00);
  });
});

