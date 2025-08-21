import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt:', { username, password });

    // Простая проверка для тестирования
    if (username === 'admin' && password === 'admin123') {
      // Создаем тестовый JWT токен
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwibG9jYXRpb25faWQiOiIxIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      return NextResponse.json({
        accessToken: mockToken,
        refreshToken: 'refresh_token_here',
        user: {
          id: '1234567890',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        }
      });
    }

    if (username === 'cashier' && password === 'cashier123') {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwicm9sZSI6ImNhc2hpZXIiLCJsb2NhdGlvbl9pZCI6IjEiLCJpYXQiOjE1MTYyMzkwMjJ9.test_token_for_cashier';
      
      return NextResponse.json({
        accessToken: mockToken,
        refreshToken: 'refresh_token_here',
        user: {
          id: '9876543210',
          username: 'cashier',
          email: 'cashier@example.com',
          role: 'cashier',
          first_name: 'Cashier',
          last_name: 'User'
        }
      });
    }

    // Если учетные данные неверны
    return NextResponse.json(
      { message: 'Неверное имя пользователя или пароль' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
