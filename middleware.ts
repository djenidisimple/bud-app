import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-edge'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value ?? null

  const isAuthRoute = pathname.startsWith('/budget')
  const isLoginRoute = pathname === '/login'

  if (isAuthRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (isLoginRoute) {
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/budget/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/budget/:path*', '/login'],
}
