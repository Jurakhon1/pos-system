import { render, screen, fireEvent } from '@testing-library/react';
import SalesPage from '@/app/manage/dash/stat/page';
import { SalesHeader } from '@/widgets/sales/sales-header';
import { SalesFilters } from '@/widgets/sales/sales-filters';
import { SalesStats } from '@/widgets/sales/sales-stats';
import { SalesChart } from '@/widgets/sales/sales-chart';
import { SalesPaymentMethods } from '@/widgets/sales/sales-payment-methods';
import { SalesOrderSources } from '@/widgets/sales/sales-order-sources';
import { SalesPopularProducts } from '@/widgets/sales/sales-popular-products';
import { SalesTable } from '@/widgets/sales/sales-table';

describe('SalesPage', () => {
  it('renders all sales components', () => {
    render(<SalesPage />);
    
    expect(screen.getByText('Продажи')).toBeInTheDocument();
    expect(screen.getByText('Анализ продаж и выручки')).toBeInTheDocument();
    expect(screen.getByText('Выручка')).toBeInTheDocument();
    expect(screen.getByText('Заказы')).toBeInTheDocument();
    expect(screen.getByText('Клиенты')).toBeInTheDocument();
    expect(screen.getByText('Средний чек')).toBeInTheDocument();
  });
});

describe('SalesHeader', () => {
  it('renders header with title and actions', () => {
    render(<SalesHeader />);
    
    expect(screen.getByText('Продажи')).toBeInTheDocument();
    expect(screen.getByText('Анализ продаж и выручки')).toBeInTheDocument();
    expect(screen.getByText('Экспорт')).toBeInTheDocument();
  });
});

describe('SalesFilters', () => {
  it('renders period and place selectors', () => {
    render(<SalesFilters />);
    
    expect(screen.getByText('Сегодня')).toBeInTheDocument();
    expect(screen.getByText('Все заведения')).toBeInTheDocument();
    expect(screen.getByText('Фильтры')).toBeInTheDocument();
  });

  it('allows changing period selection', () => {
    render(<SalesFilters />);
    
    const periodSelect = screen.getByDisplayValue('Сегодня');
    fireEvent.change(periodSelect, { target: { value: 'yesterday' } });
    
    expect(periodSelect).toHaveValue('yesterday');
  });
});

describe('SalesStats', () => {
  it('renders all stat cards', () => {
    render(<SalesStats />);
    
    expect(screen.getByText('Выручка')).toBeInTheDocument();
    expect(screen.getByText('₽ 125,430')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    
    expect(screen.getByText('Заказы')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
    
    expect(screen.getByText('Клиенты')).toBeInTheDocument();
    expect(screen.getByText('892')).toBeInTheDocument();
    
    expect(screen.getByText('Средний чек')).toBeInTheDocument();
    expect(screen.getByText('₽ 1,247')).toBeInTheDocument();
  });
});

describe('SalesChart', () => {
  it('renders hourly and weekday charts', () => {
    render(<SalesChart />);
    
    expect(screen.getByText('Продажи по часам')).toBeInTheDocument();
    expect(screen.getByText('Продажи по дням недели')).toBeInTheDocument();
    expect(screen.getByText('Сегодня, 15 декабря 2024')).toBeInTheDocument();
    expect(screen.getByText('За последнюю неделю')).toBeInTheDocument();
  });
});

describe('SalesPaymentMethods', () => {
  it('renders payment methods section', () => {
    render(<SalesPaymentMethods />);
    
    expect(screen.getByText('Способы оплаты')).toBeInTheDocument();
    expect(screen.getByText('Распределение по методам оплаты')).toBeInTheDocument();
    expect(screen.getByText('Банковские карты')).toBeInTheDocument();
    expect(screen.getByText('Наличные')).toBeInTheDocument();
    expect(screen.getByText('Электронные кошельки')).toBeInTheDocument();
  });
});

describe('SalesOrderSources', () => {
  it('renders order sources section', () => {
    render(<SalesOrderSources />);
    
    expect(screen.getByText('Источники заказов')).toBeInTheDocument();
    expect(screen.getByText('Распределение по каналам продаж')).toBeInTheDocument();
    expect(screen.getByText('Мобильное приложение')).toBeInTheDocument();
    expect(screen.getByText('Веб-сайт')).toBeInTheDocument();
    expect(screen.getByText('Касса в заведении')).toBeInTheDocument();
  });
});

describe('SalesPopularProducts', () => {
  it('renders popular products section', () => {
    render(<SalesPopularProducts />);
    
    expect(screen.getByText('Популярные товары')).toBeInTheDocument();
    expect(screen.getByText('Топ продаж за период')).toBeInTheDocument();
    expect(screen.getByText('Пицца Маргарита')).toBeInTheDocument();
    expect(screen.getByText('Бургер Классический')).toBeInTheDocument();
    expect(screen.getByText('Салат Цезарь')).toBeInTheDocument();
  });
});

describe('SalesTable', () => {
  it('renders sales table with data', () => {
    render(<SalesTable />);
    
    expect(screen.getByText('Последние продажи')).toBeInTheDocument();
    expect(screen.getByText('Время')).toBeInTheDocument();
    expect(screen.getByText('Номер заказа')).toBeInTheDocument();
    expect(screen.getByText('Сумма')).toBeInTheDocument();
    expect(screen.getByText('Товары')).toBeInTheDocument();
    expect(screen.getByText('Способ оплаты')).toBeInTheDocument();
    expect(screen.getByText('Статус')).toBeInTheDocument();
    expect(screen.getByText('Действия')).toBeInTheDocument();
  });

  it('allows searching in table', () => {
    render(<SalesTable />);
    
    const searchInput = screen.getByPlaceholderText('Поиск по заказам...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(searchInput).toHaveValue('test');
  });

  it('displays sales data correctly', () => {
    render(<SalesTable />);
    
    expect(screen.getByText('14:32')).toBeInTheDocument();
    expect(screen.getByText('#12345')).toBeInTheDocument();
    expect(screen.getByText('₽ 2,450')).toBeInTheDocument();
    expect(screen.getByText('5 шт.')).toBeInTheDocument();
    expect(screen.getByText('Карта')).toBeInTheDocument();
    expect(screen.getByText('Оплачен')).toBeInTheDocument();
  });
});
