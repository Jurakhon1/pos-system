import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    console.log('Register attempt:', { username, role });

    // Простая проверка для тестирования
    if (username && password && role) {
      return NextResponse.json({
        message: 'Пользователь успешно зарегистрирован',
        user: {
          username,
          role
        }
      });
    }

    // Если данные неполные
    return NextResponse.json(
      { message: 'Неполные данные для регистрации' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
