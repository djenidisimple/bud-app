import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const { pathname } = request.nextUrl

    // Routes protégées
    if (!token && pathname.startsWith('/budget')) {
        const url = new URL('/login', request.url)
        url.searchParams.set('from', pathname) // Conserve l'URL demandée
        return NextResponse.redirect(url)
    }

    // Redirection si déjà connecté
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/budget/dashboard', request.url))
    }

    return NextResponse.next()
}

// Config pour spécifier sur quelles routes le middleware s'applique
export const config = {
    matcher: ['/budget/:path*', '/login'],
}