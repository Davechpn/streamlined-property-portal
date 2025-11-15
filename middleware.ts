import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/reset-password'];

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/signin', '/signup', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has auth token (stored in httpOnly cookie)
  const authToken = request.cookies.get('auth_token');
  const isAuthenticated = !!authToken;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/invitations/'))) {
    // If authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    // Additional admin check would happen here (checking user role from token)
    // For now, allow if authenticated
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|sentry-example-page).*)',
  ],
};
