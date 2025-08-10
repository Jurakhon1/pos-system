import { render, screen, fireEvent } from '@testing-library/react';
import { SideMenu } from '@/shared/ui/side-menu/side-menu';

describe('SideMenu', () => {
  it('renders menu items correctly', () => {
    render(<SideMenu />);
    
    expect(screen.getByText('Статистика')).toBeInTheDocument();
    expect(screen.getByText('Финансы')).toBeInTheDocument();
    expect(screen.getByText('Меню')).toBeInTheDocument();
  });

  it('expands submenu when clicked', () => {
    render(<SideMenu />);
    
    const statsButton = screen.getByText('Статистика');
    fireEvent.click(statsButton);
    
    expect(screen.getByText('Продажи')).toBeInTheDocument();
    expect(screen.getByText('Клиенты')).toBeInTheDocument();
  });

  it('toggles collapse state', () => {
    render(<SideMenu />);
    
    const collapseButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(collapseButton);
    
    // Проверяем, что меню свернуто
    expect(screen.queryByText('Статистика')).not.toBeInTheDocument();
  });
});
