import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import POSPage from '../src/app/pos/page';

// Мокаем зависимости
jest.mock('../src/entities/cart', () => ({
  useCart: () => ({
    items: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
  }),
}));

jest.mock('../src/features/order-creation/hooks/useOrderCreation', () => ({
  useOrderCreation: () => ({
    createOrder: jest.fn(),
    isCreating: false,
  }),
}));

jest.mock('../src/entities/menu-item/hooks/useMenuItem', () => ({
  useMenuItems: () => ({
    menuItems: [
      {
        id: '1',
        name: 'Ролл Калифорния',
        price: 450,
        description: 'Классический ролл с крабом',
        image_url: 'https://example.com/california.jpg',
        category_id: 'cat1',
        category: { id: 'cat1', name: 'Роллы' },
      },
      {
        id: '2',
        name: 'Ролл Филадельфия',
        price: 550,
        description: 'Ролл с лососем и сливочным сыром',
        image_url: 'https://example.com/philadelphia.jpg',
        category_id: 'cat1',
        category: { id: 'cat1', name: 'Роллы' },
      },
      {
        id: '3',
        name: 'Суп Мисо',
        price: 250,
        description: 'Традиционный японский суп',
        image_url: null,
        category_id: 'cat2',
        category: { id: 'cat2', name: 'Супы' },
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

jest.mock('../src/entities/categories/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 'cat1', name: 'Роллы', display_order: 1 },
      { id: 'cat2', name: 'Супы', display_order: 2 },
    ],
  }),
}));

jest.mock('../src/entities/tables/hooks/useTables', () => ({
  useTables: () => ({
    tables: [],
    isLoading: false,
    error: null,
    fetchTables: jest.fn(),
    updateTableStatus: jest.fn(),
  }),
}));

jest.mock('../src/shared/components/RoleGuard', () => ({
  RoleGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('POS Page Categories', () => {
  test('отображает блюда, сгруппированные по категориям', () => {
    render(<POSPage />);
    
    // Проверяем, что заголовки категорий отображаются
    expect(screen.getByText('Роллы')).toBeInTheDocument();
    expect(screen.getByText('Супы')).toBeInTheDocument();
    
    // Проверяем, что блюда отображаются в соответствующих категориях
    expect(screen.getByText('Ролл Калифорния')).toBeInTheDocument();
    expect(screen.getByText('Ролл Филадельфия')).toBeInTheDocument();
    expect(screen.getByText('Суп Мисо')).toBeInTheDocument();
  });

  test('показывает количество блюд в каждой категории', () => {
    render(<POSPage />);
    
    // Проверяем счетчики блюд
    expect(screen.getByText('2 блюда')).toBeInTheDocument(); // Роллы
    expect(screen.getByText('1 блюдо')).toBeInTheDocument(); // Супы
  });

  test('фильтрует блюда по выбранной категории', () => {
    render(<POSPage />);
    
    // Нажимаем на категорию "Роллы"
    const rollsButton = screen.getByText('Роллы');
    fireEvent.click(rollsButton);
    
    // Проверяем, что отображаются только роллы
    expect(screen.getByText('Ролл Калифорния')).toBeInTheDocument();
    expect(screen.getByText('Ролл Филадельфия')).toBeInTheDocument();
    expect(screen.queryByText('Суп Мисо')).not.toBeInTheDocument();
  });

  test('показывает статистику по категориям', () => {
    render(<POSPage />);
    
    // Проверяем статистику
    expect(screen.getByText('3')).toBeInTheDocument(); // Всего блюд
    expect(screen.getByText('2')).toBeInTheDocument(); // Категорий
    expect(screen.getByText('2')).toBeInTheDocument(); // С фото
  });

  test('поиск работает по названию и описанию блюд', () => {
    render(<POSPage />);
    
    const searchInput = screen.getByPlaceholderText('Поиск блюд...');
    fireEvent.change(searchInput, { target: { value: 'калифорния' } });
    
    // Проверяем, что найден только ролл Калифорния
    expect(screen.getByText('Ролл Калифорния')).toBeInTheDocument();
    expect(screen.queryByText('Ролл Филадельфия')).not.toBeInTheDocument();
    expect(screen.queryByText('Суп Мисо')).not.toBeInTheDocument();
  });

  test('кнопка "Сбросить" очищает все фильтры', () => {
    render(<POSPage />);
    
    // Сначала выбираем категорию
    const rollsButton = screen.getByText('Роллы');
    fireEvent.click(rollsButton);
    
    // Проверяем, что фильтр применен
    expect(screen.queryByText('Суп Мисо')).not.toBeInTheDocument();
    
    // Нажимаем "Сбросить"
    const resetButton = screen.getByText('Сбросить');
    fireEvent.click(resetButton);
    
    // Проверяем, что все блюда снова отображаются
    expect(screen.getByText('Суп Мисо')).toBeInTheDocument();
  });
});
