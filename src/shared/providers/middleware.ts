import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Роуты, которые требуют аутентификации
const protectedRoutes = [
  '/dashboard',
  '/sales', 
  '/kitchen',
  '/reports',
  '/settings',
  '/pos'
]

// Роуты аутентификации
const authRoutes = [
  '/login',
  '/register'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Если пользователь не аутентифицирован и пытается получить доступ к защищенным роутам
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Если пользователь аутентифицирован и пытается получить доступ к роутам аутентификации
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
