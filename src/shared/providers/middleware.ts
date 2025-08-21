import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Роуты, которые требуют аутентификации
const protectedRoutes = [
  '/dashboard',
  '/sales', 
  '/kitchen',
  '/reports',
  '/settings',
  '/pos',
  '/orders',
  '/admin'
]

// Роуты аутентификации
const authRoutes = [
  '/login',
  '/register'
]

// Маппинг ролей на доступные страницы
const ROLE_ACCESS = {
  'superadmin': ['/dashboard', '/admin', '/reports', '/settings', '/kitchen', '/pos', '/orders'],
  'admin': ['/dashboard', '/admin', '/reports', '/settings', '/kitchen', '/pos', '/orders'],
  'cashier': ['/pos', '/orders'],
  'manager': ['/dashboard', '/reports', '/settings', '/kitchen', '/pos', '/orders'],
  'chef': ['/kitchen'],
  'cook': ['/kitchen'],
  'waiter': ['/pos', '/orders']
}

// Дефолтная страница для каждой роли
const ROLE_DEFAULT_PAGE = {
  'superadmin': '/dashboard',
  'admin': '/dashboard',
  'cashier': '/pos',
  'manager': '/dashboard',
  'chef': '/kitchen',
  'cook': '/kitchen',
  'waiter': '/pos'
}

// Кэш для JWT токенов (в памяти, для производительности)
const tokenCache = new Map<string, { payload: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// Функция для декодирования JWT токена с кэшированием
function decodeJWT(token: string) {
  // Проверяем кэш
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.payload;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    // Кэшируем результат
    tokenCache.set(token, { payload, timestamp: Date.now() });
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Функция для проверки доступа пользователя к странице
function hasAccessToPage(userRole: string, pathname: string): boolean {
  const allowedPages = ROLE_ACCESS[userRole as keyof typeof ROLE_ACCESS];
  if (!allowedPages) return false;
  
  return allowedPages.some(page => pathname.startsWith(page));
}

// Функция для очистки устаревших записей кэша
function cleanupCache() {
  const now = Date.now();
  for (const [token, data] of tokenCache.entries()) {
    if (now - data.timestamp > CACHE_TTL) {
      tokenCache.delete(token);
    }
  }
}

// Очищаем кэш каждые 10 минут
setInterval(cleanupCache, 10 * 60 * 1000);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Пропускаем API роуты
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Пропускаем статические файлы
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/fonts')) {
    return NextResponse.next()
  }

  // Пропускаем тестовые страницы
  if (pathname.startsWith('/test-')) {
    return NextResponse.next()
  }

  // Если пользователь не аутентифицирован и пытается получить доступ к защищенным роутам
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Если пользователь аутентифицирован и пытается получить доступ к роутам аутентификации
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    // Декодируем токен для получения роли
    const payload = decodeJWT(token);
    if (payload && payload.role) {
      const defaultPage = ROLE_DEFAULT_PAGE[payload.role as keyof typeof ROLE_DEFAULT_PAGE];
      if (defaultPage) {
        return NextResponse.redirect(new URL(defaultPage, request.url))
      }
    }
    // Если не удалось определить роль, перенаправляем на dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Если пользователь аутентифицирован, проверяем доступ к странице на основе роли
  if (token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const payload = decodeJWT(token);
    if (payload && payload.role) {
      const userRole = payload.role;
      
      // Проверяем доступ к текущей странице
      if (!hasAccessToPage(userRole, pathname)) {
        // Если нет доступа, перенаправляем на страницу по умолчанию для роли
        const defaultPage = ROLE_DEFAULT_PAGE[userRole as keyof typeof ROLE_DEFAULT_PAGE];
        if (defaultPage) {
          return NextResponse.redirect(new URL(defaultPage, request.url))
        }
      }
    }
  }

  // Добавляем заголовки для оптимизации
  const response = NextResponse.next()
  
  // Кэширование для статических страниц
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - fonts (font files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
}
